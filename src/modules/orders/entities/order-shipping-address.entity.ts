import { BaseEntity } from "@/common/entities/base.entity";
import { Order } from "@/modules/orders/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('order_shipping_address')
export class OrderShippingAddress extends BaseEntity {
    @Column({
        name: 'order_id',
        type: 'int',
        unsigned: true
    })
    orderId: number;

    @Column({
        name: 'recipient_name',
        type: 'varchar',
        length: 255
    })
    recipientName: string;

    @Column({
        type: 'varchar',
        length: 20
    })
    phone: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    line1: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    line2: string | null;

    @Column({
        type: 'varchar',
        length: 100
    })
    city: string;

    @Column({
        name: 'postal_code',
        type: 'varchar',
        length: 20
    })
    postalCode: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    country: string;

    // Relations
    @OneToOne(() => Order, (order) => order.orderShippingAddress, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;
}