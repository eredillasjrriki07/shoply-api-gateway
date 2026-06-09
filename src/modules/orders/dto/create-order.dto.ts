import { CreateOrderItemDto } from "@/modules/orders/dto/create-order-item.dto";
import { CreateOrderPaymentDto } from "@/modules/orders/dto/create-order-payment.dto";
import { CreateOrderShippingAddressDto } from "@/modules/orders/dto/create-order-shipping-address.dto";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsUUID, MaxLength, Min, ValidateNested } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsNumber()
    @Min(0)
    shippingFee: number;

    @ValidateNested()
    @Type(() => CreateOrderShippingAddressDto)
    shippingAddress: CreateOrderShippingAddressDto;

    @ValidateNested()
    @Type(() => CreateOrderPaymentDto)
    payment: CreateOrderPaymentDto;

    @IsOptional()
    @IsUUID()
    promoId?: string;
}