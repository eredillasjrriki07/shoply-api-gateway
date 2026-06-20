import { CreateProductDto } from "@/modules/products/dto/create-product.dto";
import { PartialType } from "@nestjs/mapped-types"

export class UpdateProductDto extends PartialType(CreateProductDto) { }