import { BaseEntity } from "@/common/entities/base.entity";
import { UserRole } from "@/common/enums/roles.enum";
import { Order } from "@/modules/orders/entities/order.entity";
import { Review } from "@/modules/reviews/review.entity";
import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User extends BaseEntity {
    @Index({ unique: true })
    @Column({ length: 255 })
    email!: string;

    @Column({
        name: "password_hash",
        length: 255,
    })
    passwordHash!: string;

    @Column({
        name: "first_name",
        length: 100
    })
    firstName!: string;

    @Column({ name: "last_name", length: 100 })
    lastName!: string;

    @Column({
        type: "enum",
        enum: UserRole
    })
    role!: UserRole;

    @Column({
        name: "is_active",
        default: true
    })
    isActive: boolean;

    @Column({
        name: "last_login_at",
        type: "datetime",
        nullable: true
    })
    lastLoginAt?: Date | null;

    // Relations
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany (() => Review, (review) => review.user)
    reviews: Review[];
}