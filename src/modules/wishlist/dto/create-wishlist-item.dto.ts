import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateWishlistItemDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    productId: string;
}