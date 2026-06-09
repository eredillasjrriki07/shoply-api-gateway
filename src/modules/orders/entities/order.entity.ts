import { OrderStatus } from "@/common/enums/order-status.enum";
import { OrderItem } from "@/modules/orders/entities/order-item.entity";
import { OrderPayment } from "@/modules/orders/entities/order-payment.entity";
import { OrderShippingAddress } from "@/modules/orders/entities/order-shipping-address.entity";
import { OrderTimelineEvent } from "@/modules/orders/entities/order-timeline-events.entity";
import { Promo } from "@/modules/promos/promo.entity";
import { User } from "@/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("order")
export class Order {
    @PrimaryGeneratedColumn('increment', {
        unsigned: true
    })
    id: number;

    @Column({
        name: 'user_id',
        length: 36
    })
    userId: string;

    @Column({
        name: "order_number",
        type: "varchar",
        nullable: true,
        unique: true
    })
    orderNumber: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.TO_SHIP
    })
    status: OrderStatus;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    subtotal: number;

    @Column({
        name: 'shipping_fee',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    shippingFee: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    tax: number;

    @Column({
        name: 'promo_id',
        length: 36
    })
    promoId: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        generatedType: "STORED",
        asExpression: "subtotal + shipping_fee + tax"
    })
    total: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];

    @OneToOne(() => OrderShippingAddress, (orderShippingAddress) => orderShippingAddress.order)
    orderShippingAddress: OrderShippingAddress;

    @OneToOne(() => OrderPayment, (orderPayment) => orderPayment.order)
    orderPayment: OrderPayment;

    @OneToMany(() => OrderTimelineEvent, (orderTimelineEvent) => orderTimelineEvent.order)
    orderTimelineEvents: OrderTimelineEvent[];

    @ManyToOne(() => Promo, (promo) => promo.orders)
    @JoinColumn({ name: 'promo_id' })
    promo: Promo;
}