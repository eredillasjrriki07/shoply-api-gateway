import { CreateOrderItemDto } from "@/modules/orders/dto/create-order-item.dto";
import { CreateOrderPaymentDto } from "@/modules/orders/dto/create-order-payment.dto";
import { CreateOrderShippingAddressDto } from "@/modules/orders/dto/create-order-shipping-address.dto";
import { OrderItem } from "@/modules/orders/entities/order-item.entity";
import { OrderPayment } from "@/modules/orders/entities/order-payment.entity";
import { OrderShippingAddress } from "@/modules/orders/entities/order-shipping-address.entity";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from "class-validator";

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
}