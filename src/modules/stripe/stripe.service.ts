import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    constructor(
        @Inject('STRIPE')
        private readonly stripe: Stripe.Stripe,
    ) { }

    async createCheckoutSession(orderId: number, lineItems: OrderItem[], total: number) {
        const session = await this.stripe.checkout.sessions.create({
            line_items: lineItems.map(item => ({
                price_data: {
                    currency: 'php',
                    product_data: {
                        name: item.productName,
                    },
                    unit_amount: Math.round(item.unitPrice * 100)
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            metadata: {
                orderId: orderId.toString(),
                total: total.toString(),
            },
            success_url: 'http://localhost:3000/complete',
            cancel_url: 'http://localhost:3000/cancel',
        });

        return session;
    }

    async resumeCheckoutSession(sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        if (session.status === 'open' && session.url) {
            return { url: session.url }
        }
        
        throw new InternalServerErrorException('Unknown error has occured on resuming checkout_session_id!');
    }

    verifyWebhook(rawBody: Buffer, signature: string) {
        return this.stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    }
}