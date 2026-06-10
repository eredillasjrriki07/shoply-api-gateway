import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
