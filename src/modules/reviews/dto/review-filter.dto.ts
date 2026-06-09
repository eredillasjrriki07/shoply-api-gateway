import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class ReviewFilterDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsOptional()
    @IsUUID()
    userId?: string;
    
    @IsOptional()
    @IsUUID()
    orderItemId?: string;
}