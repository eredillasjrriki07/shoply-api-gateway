import { BaseEntity } from "@/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductVariant } from "../products/entities/product-variant.entity";

@Entity('cart_item')
export class CartItem extends BaseEntity {
    @Column({
        name: 'user_id',
        type: 'uuid',
        length: 36,
    })
    userId: string;

    @Column({
        name: 'variant_id',
        type: 'uuid',
        length: 36,
    })
    variantId: string;

    @Column({
        type: 'int',
        unsigned: true
    })
    quantity: number;

    // Relations
    @ManyToOne(() => ProductVariant)
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;
}