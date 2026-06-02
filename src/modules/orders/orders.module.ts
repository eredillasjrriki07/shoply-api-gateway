import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/modules/orders/entities/order.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { OrderPayment } from '@/modules/orders/entities/order-payment.entity';
import { OrderShippingAddress } from '@/modules/orders/entities/order-shipping-address.entity';
import { OrderTimelineEvent } from '@/modules/orders/entities/order-timeline-events.entity';
import { OrderWithAggregates } from '@/modules/orders/entities/order-with-aggregates.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderShippingAddress,
      OrderPayment,
      OrderTimelineEvent,
      OrderWithAggregates
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule { }
