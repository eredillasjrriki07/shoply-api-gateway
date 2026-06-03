import { StripeService } from '@/modules/stripe/stripe.service';
import { DynamicModule, Module } from '@nestjs/common';
import Stripe = require('stripe');

@Module({})
export class StripeModule {
    static forRoot(apiKey: string, config: ConstructorParameters<typeof Stripe>[1]): DynamicModule {
        const stripe = new Stripe(apiKey, config);
        return {
            module: StripeModule,
            providers: [
                {
                    provide: 'STRIPE',
                    useValue: stripe
                },
                StripeService
            ],
            exports: [
                'STRIPE',
                StripeService
            ],
            global: true,
        };
    }
}
