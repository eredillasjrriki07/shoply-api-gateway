import { BaseEntity } from "@/common/entities/base.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";

@Entity('product_variant')
@Unique('uq_variant_sku', ['sku'])
@Unique('uq_variant', ['productId', 'size', 'color'])
export class ProductVariant extends BaseEntity {
    @Column({
        name: 'product_id',
        length: 36,
    })
    productId: string;

    @Column({
        length: 50,
    })
    sku: string;

    @Column({
        length: 20,
        nullable: true,
    })
    size: string;

    @Column({
        length: 50,
        nullable: true,
    })
    color: string;

    @Column({
        name: 'price_override',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    priceOverride: number;

    @Column({
        type: 'int',
        unsigned: true,
        default: 0,
    })
    stocks: number;

    @ManyToOne(() => Product, (product) => product.productVariants, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

}