import { ProductDto } from "@/modules/products/dto/base/product.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class ProductSizeDto {
    @IsNotEmpty()
    @IsString()
    value: string;
}