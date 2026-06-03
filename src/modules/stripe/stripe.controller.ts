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
            await this.orderService.markAsPaid(orderId, total, session.payment_intent);
        }

        return { received: true }
    }
}
