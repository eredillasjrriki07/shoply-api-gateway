import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    constructor(
        @Inject('STRIPE')
        private readonly stripe: Stripe.Stripe,
    ) { }

    private readonly logger = new Logger(StripeService.name);

    async createCheckoutSession(orderId: number, lineItems: OrderItem[], total: number) {
        try {
            this.logger.log(`Creating checkout session for order with id ${orderId} with total of ${total}`);

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

            this.logger.log(`Successfully created checkout session. URL: ${session.url}`);

            return session;

        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException('Unknown error occured.');
        }
    }

    async resumeCheckoutSession(sessionId: string) {
        this.logger.log(`Resuming checkout session with id ${sessionId}`);

        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        if (session.status === 'open' && session.url) {
            return { url: session.url }
        }

        this.logger.warn(`Unknown error has occured on resuming session ${sessionId})`);

        throw new InternalServerErrorException(`Unknown error has occured on resuming session ${sessionId})`);
    }

    async createRefundSession(orderId: number, paymentRef: string, amount: number) {
        try {
            this.logger.log(`Creating refund session for order with id ${orderId} with payment reference of ${paymentRef} and a total of ${amount}`);

            const refundSession = await this.stripe.refunds.create({
                payment_intent: paymentRef,
                amount: Math.round(amount * 100),
                metadata: {
                    orderId: orderId.toString(),
                    amountRefunded: amount.toString(),
                }
            });

            this.logger.log(`Successfully created refund session. ID: ${refundSession.id}`);

            return refundSession;

        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException('Unknown error occured.');
        }
    }

    verifyWebhook(rawBody: Buffer, signature: string) {
        return this.stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    }
}