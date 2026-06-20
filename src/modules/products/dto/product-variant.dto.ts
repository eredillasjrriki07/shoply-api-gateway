import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ProductVariantDto {
    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsOptional()
    @IsString()
    size: string;

    @IsOptional()
    @IsString()
    color: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    priceOverride: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    stocks: number = 0;
}