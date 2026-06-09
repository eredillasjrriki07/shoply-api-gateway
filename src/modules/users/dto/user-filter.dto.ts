import { Type } from "class-transformer";
import { IsEmail, IsInt, IsOptional, Min } from "class-validator";

export class UserFilterDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsEmail()
    email: string;
}