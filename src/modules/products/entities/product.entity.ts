import { BaseEntity } from "@/common/entities/base.entity";
import { ProductCategory } from "@/common/enums/product-category.enum";
import { ProductColor } from "@/modules/products/entities/product-color.entity";
import { ProductSize } from "@/modules/products/entities/product-size.entity";
import { ProductVariant } from "@/modules/products/entities/product-variant.entity";
import { Review } from "@/modules/reviews/review.entity";
import { Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";

@Entity("product")
export class Product extends BaseEntity {
    @Column({ length: 255 })
    name!: string;

    @Column({
        name: 'image_url',
        length: 500,
        nullable: true,
    })
    imageUrl!: string;

    @Index("idx_products_category")
    @Column({
        type: 'enum',
        enum: ProductCategory
    })
    category: ProductCategory;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    price: number;

    @Column({
        name: 'old_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    oldPrice: number;

    @Column({
        type: 'text'
    })
    description: string;

    @Index("idx_products_is_active")
    @Column({
        name: 'is_active',
        default: true,
    })
    isActive: boolean;

    // Relations
    @OneToMany(() => ProductSize, (size) => size.product)
    sizes: ProductSize[];

    @OneToMany(() => ProductColor, (color) => color.product)
    colors: ProductColor[];

    @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
    productVariants: ProductVariant[];

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];
};