import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/modules/orders/entities/order.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { OrderPayment } from '@/modules/orders/entities/order-payment.entity';
import { OrderShippingAddress } from '@/modules/orders/entities/order-shipping-address.entity';
import { OrderTimelineEvent } from '@/modules/orders/entities/order-timeline-events.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderShippingAddress,
      OrderPayment,
      OrderTimelineEvent 
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule { }
