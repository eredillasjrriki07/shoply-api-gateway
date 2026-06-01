import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    @IsUUID()
    orderItemId: string;

    @IsNumber()
    @Min(1)
    @Max(5 )
    rating: number;

    @IsOptional()
    @IsString()
    @MaxLength(360)
    comment?: string;
}