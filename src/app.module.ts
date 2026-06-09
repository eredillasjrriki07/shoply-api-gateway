import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from './modules/users/users.module';
import { User } from "./modules/users/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from './modules/products/products.module';
import { Product } from "@/modules/products/entities/product.entity";
import { ProductSize } from "@/modules/products/entities/product-size.entity";
import { ProductColor } from "@/modules/products/entities/product-color.entity";
import { ProductVariant } from "@/modules/products/entities/product-variant.entity";
import { ProductWithAggregates } from "@/modules/products/entities/product-with-aggregates.view";
import { OrdersModule } from './modules/orders/orders.module';
import { Order } from "@/modules/orders/entities/order.entity";
import { OrderItem } from "@/modules/orders/entities/order-item.entity";
import { OrderShippingAddress } from "@/modules/orders/entities/order-shipping-address.entity";
import { OrderPayment } from "@/modules/orders/entities/order-payment.entity";
import { OrderTimelineEvent } from "@/modules/orders/entities/order-timeline-events.entity";
import { ReviewsModule } from './modules/reviews/reviews.module';
import { Review } from "@/modules/reviews/review.entity";
import { OrderWithAggregates } from "@/modules/orders/entities/order-with-aggregates.view";
import { StripeModule } from './modules/stripe/stripe.module';
import { StripeController } from './modules/stripe/stripe.controller';
import { PromosModule } from './modules/promos/promos.module';
import { Promo } from "./modules/promos/promo.entity";
import { CustomersView } from "./modules/users/entities/customers.view";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DATABASE_HOST"),
        port: config.get<number>("DATABASE_PORT"),
        username: config.get<string>("DATABASE_USER"),
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME"),
        entities: [
          User,
          CustomersView,
          Product,
          ProductSize,
          ProductColor,
          ProductVariant,
          ProductWithAggregates,
          Order,
          OrderItem,
          OrderShippingAddress,
          OrderPayment,
          OrderTimelineEvent,
          OrderWithAggregates,
          Review,
          Promo
        ],
        synchronize: false, // never true in production — use migrations
        charset: "utf8mb4_unicode_ci",
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    StripeModule.forRoot(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' }),
    PromosModule,
  ],
  controllers: [StripeController],
})
export class AppModule { }