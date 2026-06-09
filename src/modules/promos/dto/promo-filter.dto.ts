import { PromoType } from "@/common/enums/promo.type.num";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, MaxLength, Min } from "class-validator";

export class PromoFilterDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @MaxLength(20)
    code?: string;
}