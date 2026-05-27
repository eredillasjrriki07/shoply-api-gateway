import { ProductDto } from "@/modules/products/dto/base/product.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class ProductColorDto {
    @IsNotEmpty()
    @IsString()
    value: string;
}