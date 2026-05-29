import { PaymentMethod } from "@/common/enums/payment-method.enum";
import { IsEnum } from "class-validator";

export class CreateOrderPaymentDto {
    @IsEnum(PaymentMethod)
    method: PaymentMethod = PaymentMethod.CARD;
}