import { OrderEventType } from '@/common/enums/order-event-type.enum';
import { OrderStatus } from '@/common/enums/order-status.enum';
import { PaymentStatus } from '@/common/enums/payment-status.enum';
import { CreateOrderDto } from '@/modules/orders/dto/create-order.dto';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { OrderPayment } from '@/modules/orders/entities/order-payment.entity';
import { OrderShippingAddress } from '@/modules/orders/entities/order-shipping-address.entity';
import { OrderTimelineEvent } from '@/modules/orders/entities/order-timeline-events.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { ProductVariant } from '@/modules/products/entities/product-variant.entity';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, MoreThan, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly dataSource: DataSource
    ) { }

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
                status: OrderStatus.TO_SHIP,
                subtotal: subtotal,
                shippingFee: createOrderDto.shippingFee,
                tax: 0
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
}
