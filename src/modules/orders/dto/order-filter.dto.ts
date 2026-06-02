import { BaseFilterDto } from "@/common/entities/base.dto";
import { OrderStatus } from "@/common/enums/order-status.enum";
import { IsEnum, IsISO8601, IsOptional } from "class-validator";

export class OrderFilterDto extends BaseFilterDto {
    @IsOptional()
    @IsISO8601()
    fromDate?: string;

    @IsOptional()
    @IsISO8601()
    toDate?: string;

    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}