import { BaseEntity } from "@/common/entities/base.entity";
import { PromoType } from "@/common/enums/promo.type.num";
import { Column, Entity, OneToMany } from "typeorm";
import { Order } from "../orders/entities/order.entity";

@Entity('promo')
export class Promo extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 20,
        unique: true
    })
    code: string;

    @Column({
        type: 'enum',
        enum: PromoType
    })
    type: PromoType;

    @Column({
        type: 'varchar',
        length: 50
    })
    value: string;

    @Column({
        type: 'varchar',
        length: 50
    })
    label: string;

    // Relations
    @OneToMany(() => Order, (order) => order.promo)
    orders: Order[];
}