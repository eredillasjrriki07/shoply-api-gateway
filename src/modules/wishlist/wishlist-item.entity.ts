import { BaseEntity } from "@/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "../products/entities/product.entity";

@Entity('wishlist_item')
export class WishlistItem extends BaseEntity {
    @Column({
        name: 'user_id',
        type: 'uuid',
        length: 36,
    })
    userId: string;

    @Column({
        name: 'product_id',
        type: 'uuid',
        length: 36,
    })
    productId: string;

    // Relations
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}