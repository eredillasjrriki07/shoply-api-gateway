import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    async get(@Param('userId', ParseUUIDPipe) userId: string) {
        return await this.cartService.getCartItems(userId);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCartItemDto: CreateCartItemDto) {
        return await this.cartService.createCartItem(createCartItemDto);
    }

    @Patch('update/:id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
        return await this.cartService.updateCartItem(id, updateCartItemDto);
    }

    @Delete('remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return await this.cartService.removeCartItem(id);
    }

}
