import { OrderEventType } from '@/common/enums/order-event-type.enum';
import { OrderStatus } from '@/common/enums/order-status.enum';
import { PaymentStatus } from '@/common/enums/payment-status.enum';
import { constants } from '@/common/util/constants';
import { filterByDateRange } from '@/common/util/filter-by-date-range.util';
import { statusMap } from '@/common/util/helper';
import { CreateOrderDto } from '@/modules/orders/dto/create-order.dto';
import { OrderFilterDto } from '@/modules/orders/dto/order-filter.dto';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { OrderPayment } from '@/modules/orders/entities/order-payment.entity';
import { OrderShippingAddress } from '@/modules/orders/entities/order-shipping-address.entity';
import { OrderTimelineEvent } from '@/modules/orders/entities/order-timeline-events.entity';
import { OrderWithAggregates } from '@/modules/orders/entities/order-with-aggregates.view';
import { Order } from '@/modules/orders/entities/order.entity';
import { ProductVariant } from '@/modules/products/entities/product-variant.entity';
import { StripeService } from '@/modules/stripe/stripe.service';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, In, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderWithAggregates) private readonly orderView: Repository<OrderWithAggregates>,
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
        @InjectRepository(OrderPayment) private readonly orderPaymentRepo: Repository<OrderPayment>,
        private readonly dataSource: DataSource,
        private readonly stripeService: StripeService
    ) { }

    private readonly logger = new Logger(OrdersService.name);

    async getOrders(orderFilterDto: OrderFilterDto) {
        const where: FindOptionsWhere<OrderWithAggregates> = {};

        // Setting filters
        const dateFilter = filterByDateRange(orderFilterDto.fromDate, orderFilterDto.toDate);
        if (dateFilter) where.date = dateFilter;
        if (orderFilterDto.status) where.status = orderFilterDto.status;

        this.logger.log(`Fetching orders with filter ${JSON.stringify(where)}`);
        const count = await this.orderView.count();

        const { total } = await this.orderView.createQueryBuilder('o').select('SUM(o.total)', 'total').getRawOne();

        const orders = await this.orderView.find({
            where,
            order: { date: 'desc' },
            skip: (orderFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        this.logger.log(`Found ${count} orders with sum of ${total}`);

        return {
            page: orderFilterDto.page,
            count,
            total: Number(total),
            orders
        };
    }

    async getOrder(orderNumber: string) {
        this.logger.log(`Fetching order ${orderNumber}`);

        const order = await this.orderRepo.findOne({
            where: { orderNumber },
            relations: { orderItems: true, orderShippingAddress: true, orderPayment: true, orderTimelineEvents: true }
        });

        if (!order) {
            this.logger.log(`Order with number ${orderNumber} not found!`);
            throw new NotFoundException(`Order with number ${orderNumber} not found!`);
        }

        this.logger.log(`Successfully fetched order ${orderNumber}`);

        return order;
    }

    async getRecentOrders() {
        const orders = await this.orderView.find({
            order: { date: 'desc' },
            take: 5,
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                status: true,
                date: true,
                total: true,
            },
        });

        return orders;
    }


    async getOrderCount(date: Date) {
        return await this.orderRepo.count({
            where: { createdAt: MoreThanOrEqual(date) }
        });
    }

    async getRevenue(date: Date) {
        const { revenue } = await this.orderView
            .createQueryBuilder('o')
            .select('SUM(o.total)', 'revenue')
            .where('o.date >= :date', { date })
            .getRawOne();

        let revenueDataPoints = (await this.orderView
            .createQueryBuilder('o')
            .select("DATE_FORMAT(o.date, '%b %e')", 'date')
            .addSelect('SUM(o.total)', 'revenue')
            .where('o.date >= :date', { date })
            .groupBy("DATE_FORMAT(o.date, '%b %e')")
            .orderBy('MIN(o.date)', 'ASC')
            .getRawMany()).map((dataPoint) => ({ ...dataPoint, revenue: Number(dataPoint.revenue) }));

        return { revenue: Number(revenue), revenueDataPoints };
    }

    async getOrderStatusCounts(date: Date) {
        const statusCounts = (await this.orderView
            .createQueryBuilder('o')
            .select('o.status', 'status')
            .addSelect('COUNT(o.id)', 'count')
            .where('o.date >= :date', { date })
            .groupBy('o.status')
            .getRawMany()).map((statusCount) => ({ ...statusCount, count: Number(statusCount.count) }));

        return statusCounts;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
        this.logger.log(`Initiating order create...`);
        return this.dataSource.transaction(async (manager) => {
            this.logger.log('Looking up variants and validating stock...');
            // Look up variants and validate stock
            const variantIds = createOrderDto.items.map(item => item.variantId);
            const variants = await manager.find(ProductVariant, {
                where: { id: In(variantIds) },
                relations: { product: true },
            });

            if (variantIds.length !== variants.length) {
                this.logger.warn('One or more variant not found!');
                throw new BadRequestException('One or more variant not found!');
            }

            this.logger.log('Building line items with snapshot data and computing subtotal...');
            // Build line items with snapshot data + compute subtotal
            let subtotal = 0;
            const lineItems = createOrderDto.items.map(item => {
                const variant = variants.find(v => v.id === item.variantId)!;
                let unitPrice = variant.priceOverride ?? variant.product.oldPrice ?? variant.product.price;
                const lineTotal = unitPrice * item.quantity;
                subtotal += lineTotal;
                return {
                    variantId: item.variantId,
                    productName: variant.product.name,
                    variantLabel: [variant.size, variant.color].filter(Boolean).join(" / "),
                    quantity: item.quantity,
                    unitPrice: unitPrice
                };
            });

            this.logger.log('Decrementing stock atomically');
            // Decrement stock atomically
            for (const item of createOrderDto.items) {
                const result = await manager
                    .createQueryBuilder()
                    .update(ProductVariant)
                    .set({ stocks: () => `stocks - ${item.quantity}` })
                    .where("id = :id AND stocks >= :qty", {
                        id: item.variantId,
                        qty: item.quantity,
                    })
                    .execute();

                if (result.affected === 0) {
                    this.logger.warn(`Insufficient stock for variant ${item.variantId}`);
                    throw new ConflictException(`Insufficient stock for variant ${item.variantId}`);
                }
            }

            this.logger.log('Creating the order entry...');
            // 4. Create the order
            const order = await manager.save(Order, {
                userId: createOrderDto.userId,
                status: OrderStatus.PLACED,
                subtotal: subtotal,
                shippingFee: createOrderDto.shippingFee,
                tax: 0,
                promoId: createOrderDto.promoId
            });

            this.logger.log('Setting order number...');
            // Set order number
            order.orderNumber = `SH-TS${String(order.id).padStart(3, "0")}`;
            await manager.save(Order, order);

            this.logger.log('Inserting items to order...');
            // Insert items
            await manager.save(
                OrderItem,
                lineItems.map((item) => ({ ...item, orderId: order.id }))
            );

            this.logger.log('Inserting shipping address...');
            // Insert shipping address
            await manager.save(OrderShippingAddress, {
                orderId: order.id,
                ...createOrderDto.shippingAddress
            });

            this.logger.log('Inserting payment...');
            // Insert payment
            await manager.save(OrderPayment, {
                orderId: order.id,
                method: createOrderDto.payment.method,
                status: PaymentStatus.PENDING
            });


            this.logger.log('Inserting order timeline event...');
            // Timeline event
            await manager.save(OrderTimelineEvent, {
                orderId: order.id,
                eventType: OrderEventType.PLACED,
            });

            this.logger.log(`Successfully created order ${order.orderNumber}`);

            return order;
        });
    }

    async updateOrderTimeline(orderId: number, eventType: OrderEventType) {
        this.logger.log(`Initiating timeline update to order  ${orderId}...`);
        //  await manager.update(Order, id, { status: OrderStatus.SHIPPED });
        return this.dataSource.transaction(async (manager) => {
            const order = await manager.findOneBy(Order, { id: orderId });
            if (!order) {
                this.logger.warn(`Order with id ${orderId} not found!`);
                throw new NotFoundException(`Order with id ${orderId} not found!`);
            }

            this.logger.log(`Applying updates to order ${orderId}...`);
            // Update order
            await manager.update(Order, orderId, { status: statusMap[eventType] });

            this.logger.log(`Adding order timeline event...`);
            // Add order timeline event
            await manager.save(OrderTimelineEvent, {
                orderId,
                eventType,
            });

            const updatedOrder = await manager.findOne(Order, {
                where: { id: orderId },
                relations: { orderItems: true, orderShippingAddress: true, orderPayment: true, orderTimelineEvents: true }
            });

            this.logger.log(`Successfully moved order ${updatedOrder?.id}`);

            // Return the updated order
            return updatedOrder;
        });
    }

    async updateOrderPayment(whereOptions: FindOptionsWhere<OrderPayment>, updateOptions: Partial<OrderPayment>) {
        try {
            this.logger.log(`Updating order payment ${updateOptions.id}`);

            const { id } = updateOptions;

            const result = await this.orderPaymentRepo.update(
                whereOptions,
                updateOptions
            );

            if (result.affected === 0) {
                this.logger.warn(`Order payment with ${id} not found!`);
                throw new NotFoundException(`Order payment with ${id} not found!`);
            }

            this.logger.log(`Successfully updated order payment ${id}`);
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException('Unknown error occured.');
        }
    }

    async checkout(orderId: number) {
        this.logger.log(`Checking out order with id ${orderId}`);

        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: { orderItems: true, orderPayment: true }
        });

        if (!order) {
            this.logger.warn(`Order with id ${orderId} not found!`);
            throw new NotFoundException(`Order with id ${orderId} not found!`);
        }

        const orderPayment = order.orderPayment;

        if (orderPayment.status !== PaymentStatus.PENDING) {
            this.logger.warn(`Cannot checkout: order is ${order.status.toUpperCase()} with payment status ${orderPayment.status.toUpperCase()}`);
            throw new BadRequestException(`Cannot checkout: order is ${order.status.toUpperCase()} with payment status ${orderPayment.status.toUpperCase()}`);
        }

        if (orderPayment.checkoutSessionId) {
            return await this.stripeService.resumeCheckoutSession(orderPayment.checkoutSessionId);
        }

        const session = await this.stripeService.createCheckoutSession(order.id, order.orderItems, order.total);

        this.logger.log(`Updating OrderPayment checkout session id`);
        // Update OrderPayment checkout session id
        await this.orderPaymentRepo.update({ orderId }, { checkoutSessionId: session.id });

        this.logger.log(`Successful checkout. Updated order payment ${orderPayment.id}`);

        return { url: session.url };
    }

    async refund(orderId: number) {
        this.logger.log(`Refunding order with id ${orderId}`);

        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: { orderPayment: true }
        });

        if (!order) {
            this.logger.warn(`Order with id ${orderId} not found!`);
            throw new NotFoundException(`Order with id ${orderId} not found!`);
        }

        const orderPayment = order.orderPayment;
        // order.status !== OrderStatus.RETURN_OR_REFUND && 
        if (orderPayment.status !== PaymentStatus.PAID) {
            this.logger.warn(`Cannot refund: order is ${order.status.toUpperCase()} with payment status ${orderPayment.status.toUpperCase()}`);
            throw new BadRequestException(`Cannot refund: order is ${order.status.toUpperCase()} with payment status ${orderPayment.status.toUpperCase()}`);
        }

        this.logger.log(`Update OrderPayment checkout session id`);
        // Update OrderPayment checkout session id
        await this.orderPaymentRepo.update({ orderId }, { status: PaymentStatus.REFUND_PENDING });

        const refundAmount = orderPayment.amount - order.shippingFee;

        this.logger.log(`Creating refund session`);
        return await this.stripeService.createRefundSession(order.id, orderPayment.providerRef, refundAmount);
    }
}
