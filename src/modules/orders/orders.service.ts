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
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderWithAggregates) private readonly orderView: Repository<OrderWithAggregates>,
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
        @InjectRepository(OrderPayment) private readonly orderPaymentRepo: Repository<OrderPayment>,
        private readonly dataSource: DataSource,
        private readonly stripeService: StripeService
    ) { }

    async getOrders(orderFilterDto: OrderFilterDto) {
        const where: FindOptionsWhere<OrderWithAggregates> = {};

        // Setting filters
        const dateFilter = filterByDateRange(orderFilterDto.fromDate, orderFilterDto.toDate);
        if (dateFilter) where.date = dateFilter;
        if (orderFilterDto.status) where.status = orderFilterDto.status;

        const count = await this.orderView.count();

        const { total } = await this.orderView.createQueryBuilder('o').select('SUM(o.total)', 'total').getRawOne();

        const orders = await this.orderView.find({
            where,
            order: { date: 'desc' },
            skip: (orderFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        return {
            page: orderFilterDto.page,
            count,
            total: Number(total),
            orders
        };
    }

    async getOrder(orderNumber: string) {
        const order = await this.orderRepo.findOne({
            where: { orderNumber },
            relations: { orderItems: true, orderShippingAddress: true, orderPayment: true, orderTimelineEvents: true }
        });

        if (!order) {
            throw new NotFoundException(`Order with number ${orderNumber} not found!`);
        }

        return order;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
        return this.dataSource.transaction(async (manager) => {
            // Look up variants and validate stock
            const variantIds = createOrderDto.items.map(item => item.variantId);
            const variants = await manager.find(ProductVariant, {
                where: { id: In(variantIds) },
                relations: { product: true },
            });

            if (variantIds.length !== variants.length) {
                throw new BadRequestException('One or more variant not found!');
            }

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
                    throw new ConflictException(`Insufficient stock for variant ${item.variantId}`);
                }
            }
            // 4. Create the order
            const order = await manager.save(Order, {
                userId: createOrderDto.userId,
                status: OrderStatus.PLACED,
                subtotal: subtotal,
                shippingFee: createOrderDto.shippingFee,
                tax: 0,
                promoId: createOrderDto.promoId
            });

            // Set order number
            order.orderNumber = `SH-TS${String(order.id).padStart(3, "0")}`;
            await manager.save(Order, order);

            // Insert items
            await manager.save(
                OrderItem,
                lineItems.map((item) => ({ ...item, orderId: order.id }))
            );

            // Insert shipping address
            await manager.save(OrderShippingAddress, {
                orderId: order.id,
                ...createOrderDto.shippingAddress
            });

            // Insert payment
            await manager.save(OrderPayment, {
                orderId: order.id,
                method: createOrderDto.payment.method,
                status: PaymentStatus.PENDING
            });

            // Timeline event
            await manager.save(OrderTimelineEvent, {
                orderId: order.id,
                eventType: OrderEventType.PLACED,
            });

            return order;
        });
    }

    async updateOrderTimeline(orderId: number, eventType: OrderEventType) {
        //  await manager.update(Order, id, { status: OrderStatus.SHIPPED });
        return this.dataSource.transaction(async (manager) => {
            const order = await manager.findOneBy(Order, { id: orderId });
            if (!order) throw new NotFoundException(`Order with id ${orderId} not found!`);

            // Update order
            await manager.update(Order, orderId, { status: statusMap[eventType] });

            // Add order timeline event
            await manager.save(OrderTimelineEvent, {
                orderId,
                eventType,
            });

            // Return the updated order
            return manager.findOne(Order, {
                where: { id: orderId },
                relations: { orderItems: true, orderShippingAddress: true, orderPayment: true, orderTimelineEvents: true }
            });
        });
    }

    async updateOrderPayment(whereOptions: FindOptionsWhere<OrderPayment>, updateOptions: Partial<OrderPayment>) {
        await this.orderPaymentRepo.update(
            whereOptions,
            updateOptions
        );
    }

    async checkout(orderId: number) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: { orderItems: true, orderPayment: true }
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${orderId} not found!`);
        }

        const orderPayment = order.orderPayment;

        if (orderPayment.status !== PaymentStatus.PENDING) {
            throw new BadRequestException(`Cannot checkout: order is ${order.status.toUpperCase()} with payment status ${orderPayment.status.toUpperCase()}`);
        }

        if (orderPayment.checkoutSessionId) {
            return await this.stripeService.resumeCheckoutSession(orderPayment.checkoutSessionId);
        }

        const session = await this.stripeService.createCheckoutSession(order.id, order.orderItems, order.total);

        // Update OrderPayment checkout session id
        await this.orderPaymentRepo.update({ orderId }, { checkoutSessionId: session.id });

        return { url: session.url };
    }

    async refund(orderId: number) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: { orderPayment: true }
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${orderId} not found!`);
        }

        const orderPayment = order.orderPayment;
        // order.status !== OrderStatus.RETURN_OR_REFUND && 
        if (orderPayment.status !== PaymentStatus.PAID) {
            throw new BadRequestException(`Cannot refund: order is ${order.status.toUpperCase()} with payment status ${orderPayment.status.toUpperCase()}`);
        }

        // Update OrderPayment checkout session id
        await this.orderPaymentRepo.update({ orderId }, { status: PaymentStatus.REFUND_PENDING });

        const refundAmount = orderPayment.amount - order.shippingFee;

        return await this.stripeService.createRefundSession(order.id, orderPayment.providerRef, refundAmount);
    }
}
