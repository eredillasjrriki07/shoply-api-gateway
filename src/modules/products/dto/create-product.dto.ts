import { ProductCategory } from "@/common/enums/product-category.enum";
import { ProductColorDto } from "@/modules/products/dto/product-color.dto";
import { ProductSizeDto } from "@/modules/products/dto/product-size.dto";
import { ProductVariantDto } from "@/modules/products/dto/product-variant.dto";
import { ProductColor } from "@/modules/products/entities/product-color.entity";
import { ProductSize } from "@/modules/products/entities/product-size.entity";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @MaxLength(500)
    imageUrl: string;

    @IsNotEmpty()
    @IsEnum(ProductCategory)
    category: ProductCategory;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    oldPrice: number;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean = true;

    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => ProductSizeDto)
    sizes: ProductSizeDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => ProductColorDto)
    colors: ProductColorDto[];

    @IsArray()
    @ValidateNested()
    @Type(() => ProductVariantDto)
    variants: ProductVariantDto[];
}