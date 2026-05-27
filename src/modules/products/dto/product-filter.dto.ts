import { ProductCategory } from "@/common/enums/product-category.enum";
import { ProductStatus } from "@/common/enums/product-status.enum";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

export class ProductFilterDto { 
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    name: string;

    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;
    
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;
}