import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";

export class ReviewFilterDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

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