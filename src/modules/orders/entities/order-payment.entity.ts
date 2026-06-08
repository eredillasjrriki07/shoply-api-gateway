import { BaseEntity } from "@/common/entities/base.entity";
import { PaymentMethod } from "@/common/enums/payment-method.enum";
import { PaymentStatus } from "@/common/enums/payment-status.enum";
import { Order } from "@/modules/orders/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('order_payment')
export class OrderPayment extends BaseEntity {
    @Column({
        name: 'order_id',
        type: 'int',
        unsigned: true
    })
    orderId: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod
    })
    method: PaymentMethod

    @Column({
        name: 'checkout_session_id',
        type: 'varchar',
        length: 100,
        nullable: true
    })
    checkoutSessionId: string | null;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus

    @Column({
        name: 'provider_ref',
        type: 'varchar',
        length: 36,
        nullable: true
    })
    providerRef: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    })
    amount: number;

    @Column({
        name: 'amount_refunded',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true
    })
    amountRefunded: number;

    @Column({
        name: 'paid_at',
        type: 'datetime',
        nullable: true
    })
    paidAt: Date | null;

    // Relations
    @OneToOne(() => Order, (order) => order.orderPayment, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;
}