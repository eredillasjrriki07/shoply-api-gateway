import { BaseFilterDto } from "@/common/entities/base.dto";
import { IsEmail, IsOptional } from "class-validator";

export class UserFilterDto extends BaseFilterDto {
    @IsOptional()
    @IsEmail()
    email: string;
}