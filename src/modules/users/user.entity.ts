import { BaseEntity } from "@/common/entities/base.entity";
import { UserRole } from "@/common/enums/roles.enum";
import { Column, Entity, Index } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
    @Index({ unique: true })
    @Column({ length: 255 })
    email!: string;

    @Column({
        name: "password_hash",
        length: 255
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
}