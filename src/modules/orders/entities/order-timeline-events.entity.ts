import { BaseEntity } from "@/common/entities/base.entity";
import { OrderEventType } from "@/common/enums/order-event-type.enum";
import { Order } from "@/modules/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('order_timeline_event')
export class OrderTimelineEvent extends BaseEntity {
    @Column({
        name: 'order_id',
        type: 'int',
        unsigned: true
    })
    orderId: number;

    @Column({
        name: 'event_type',
        type: 'enum',
        enum: OrderEventType,
        default: OrderEventType.PLACED
    })
    eventType: OrderEventType;

    @Column({
        type: 'text',
        nullable: true
    })
    note: string | null;

    @Column({
        name: 'occurred_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    occurredAt: Date;

    // Relations
    @ManyToOne(() => Order, (order) => order.orderTimelineEvents, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;
}