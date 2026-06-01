import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class CreateOrderItemDto {
    @IsNotEmpty()
    @IsUUID()
    variantId: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    quantity: number;
}