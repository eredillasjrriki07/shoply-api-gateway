import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class GetReviewDto {
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