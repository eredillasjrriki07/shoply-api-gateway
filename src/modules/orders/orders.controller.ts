import { OrderEventType } from '@/common/enums/order-event-type.enum';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreateOrderDto } from '@/modules/orders/dto/create-order.dto';
import { OrderFilterDto } from '@/modules/orders/dto/order-filter.dto';
import { OrdersService } from '@/modules/orders/orders.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getOrders(@Query() orderFilterDto: OrderFilterDto) {
        return await this.orderService.getOrders(orderFilterDto);
    }

    @Get(':orderNumber')
    @HttpCode(HttpStatus.OK)
    async getOrder(@Param('orderNumber') orderNumber: string) {
        return await this.orderService.getOrder(orderNumber);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createOrderDto: CreateOrderDto) {
        return await this.orderService.createOrder(createOrderDto);
    }

    // Order events
    @Post(':orderId/to-ship')
    async toShip(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.updateOrderTimeline(orderId, OrderEventType.TO_SHIP);
    }

    @Post(':orderId/cancelled')
    async cancel(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.updateOrderTimeline(orderId, OrderEventType.CANCELLED);
    }

    @Post(':orderId/shipped')
    async ship(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.updateOrderTimeline(orderId, OrderEventType.SHIPPED);
    }

    @Post(':orderId/delivered')
    async deliver(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.updateOrderTimeline(orderId, OrderEventType.DELIVERED);
    }

    @Post(':orderId/return')
    async return(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.updateOrderTimeline(orderId, OrderEventType.RETURN_REFUND);
    }
}
