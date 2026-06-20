import { PromoType } from "@/common/enums/promo.type.num";
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreatePromoDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @Transform(({ value }) => value?.toUpperCase().trim())
    code: string;

    @IsEnum(PromoType)
    type: PromoType;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    value: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    label: string;
}