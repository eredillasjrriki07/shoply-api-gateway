import { BaseEntity } from "@/common/entities/base.entity";
import { Order } from "@/modules/orders/entities/order.entity";
import { ProductVariant } from "@/modules/products/entities/product-variant.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('order_item')
export class OrderItem extends BaseEntity {
    @Column({
        name: 'order_id',
        type: 'int',
        unsigned: true
    })
    orderId: number;

    @Column({
        name: 'variant_id',
        type: 'varchar'
    })
    variantId: string;

    @Column({
        name: 'product_name',
        type: 'varchar',
        length: 255
    })
    productName: string;

    @Column({
        name: 'variant_label',
        type: 'varchar',
        length: 36,
        nullable: true
    })
    variantLabel: string | null;

    @Column({
        type: 'int',
        unsigned: true
    })
    quantity: number;

    @Column({
        name: 'unit_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    unitPrice: number;

    @Column({
        name: 'line_total',
        type: 'decimal',
        precision: 10,
        scale: 2,
        generatedType: 'STORED',
        asExpression: 'quantity * unit_price'
    })
    lineTotal: number;

    // Relations

    @ManyToOne(() => ProductVariant)
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;

    @ManyToOne(() => Order, (order) => order.orderItems, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;
}