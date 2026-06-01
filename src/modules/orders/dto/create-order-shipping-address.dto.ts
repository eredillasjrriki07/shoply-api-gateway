import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreateOrderShippingAddressDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    recipientName: string;

    @IsPhoneNumber('PH')
    @IsString()
    @MaxLength(15)
    phone: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    line1: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    line2?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    city: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    postalCode: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    country: string;
}