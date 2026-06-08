import { PaymentStatus } from '@/common/enums/payment-status.enum';
import { OrdersService } from '@/modules/orders/orders.service';
import { StripeService } from '@/modules/stripe/stripe.service';
import { Controller, Headers, Post, Req } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly orderService: OrdersService
    ) { }

    @Post('webhook')
    async handleWebhook(
        @Req() req: Request & { rawBody: Buffer },
        @Headers('stripe-signature') signature: string,
    ) {
        const event = this.stripeService.verifyWebhook(req.rawBody, signature);

        if (event.type === 'checkout.session.completed') {

            const session = event.data.object as any;

            const orderId = Number(session.metadata.orderId);

            const total = Number(session.metadata.total);

            await this.orderService.updateOrderPayment(
                { orderId },
                {
                    status: PaymentStatus.PAID,
                    amount: total,
                    providerRef: session.payment_intent,
                    paidAt: new Date()
                }
            );
        } else if (event.type === 'charge.refunded') {

            const charge = event.data.object as any;

            const paymentIntentId = charge.payment_intent as string;

            await this.orderService.updateOrderPayment(
                { providerRef: paymentIntentId },
                {
                    status: PaymentStatus.REFUNDED,
                    amountRefunded: charge.amount_refunded / 100
                }
            );
        }

        return { received: true }
    }
}
