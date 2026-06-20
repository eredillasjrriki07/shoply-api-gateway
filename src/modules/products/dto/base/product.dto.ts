import { IsNotEmpty, IsUUID } from "class-validator";

export class ProductDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;
}