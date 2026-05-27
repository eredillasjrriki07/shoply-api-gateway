import { BaseEntity } from "@/common/entities/base.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity('product_color')
@Unique('uq_color', ['productId', 'value'])
export class ProductColor extends BaseEntity {
    @Column({
        name: 'product_id',
        length: 36
    })
    productId: string;

    @ManyToOne(() => Product, (product) => product.colors, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'product_id'})
    product: Product;

    @Column({
        length: 50
    })
    value: string;
}