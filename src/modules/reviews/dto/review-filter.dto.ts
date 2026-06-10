import { BaseFilterDto } from "@/common/entities/base.dto";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class ReviewFilterDto extends BaseFilterDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsOptional()
    @IsUUID()
    orderItemId?: string;
}