import { BaseEntity } from "@/common/entities/base.entity";
import { OrderItem } from "@/modules/orders/entities/order-item.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { User } from "@/modules/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";

@Entity('review')
@Unique(['userId', 'productId'])
export class Review extends BaseEntity {
    @Column({
        name: 'user_id',
        length: 36
    })
    userId: string;

    @Column({
        name: 'product_id',
        length: 36
    })
    productId: string;

    @Column({
        name: 'order_item_id',
        length: 36
    })
    orderItemId: string;

    @Column({
        type: 'tinyint',
        unsigned: true
    })
    rating: number;

    @Column({
        type: 'text',
        nullable: true
    })
    comment: string;

    // Relations
    @ManyToOne(() => User, (user) => user.reviews, { onDelete: "RESTRICT" })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, (product) => product.reviews, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @OneToOne(() => OrderItem, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "order_item_id" })
    orderItem: OrderItem;

}