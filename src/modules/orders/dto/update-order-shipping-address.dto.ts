import { CreateOrderShippingAddressDto } from "@/modules/orders/dto/create-order-shipping-address.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateOrderShippingAddressDto extends PartialType(CreateOrderShippingAddressDto) { }