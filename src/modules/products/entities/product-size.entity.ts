import { BaseEntity } from "@/common/entities/base.entity";
import { Product } from "@/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity('product_size')
@Unique('uq_size', ['productId', 'value'])
export class ProductSize extends BaseEntity {
    @Column({
        name: 'product_id',
        length: 36
    })
    productId: string;

    @ManyToOne(() => Product, (product) => product.sizes, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'product_id'})
    product: Product;

    @Column({
        length: 20
    })
    value: string;
}