import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreateOrderDto } from '@/modules/orders/dto/create-order.dto';
import { OrdersService } from '@/modules/orders/orders.service';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService
    ) { }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createOrderDto: CreateOrderDto) {
        return await this.orderService.createOrder(createOrderDto);
    }
}
