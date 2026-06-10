import { BaseFilterDto } from "@/common/entities/base.dto";
import { IsOptional, MaxLength } from "class-validator";

export class PromoFilterDto extends BaseFilterDto {
    @IsOptional()
    @MaxLength(20)
    code?: string;
}