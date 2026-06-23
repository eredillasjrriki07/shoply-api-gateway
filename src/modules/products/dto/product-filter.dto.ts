import { BaseFilterDto } from "@/common/entities/base.dto";
import { ProductCategory } from "@/common/enums/product-category.enum";
import { ProductStatus } from "@/common/enums/product-status.enum";
import { IsEnum, IsOptional } from "class-validator";

export class ProductFilterDto extends BaseFilterDto{ 
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;
    
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;
}