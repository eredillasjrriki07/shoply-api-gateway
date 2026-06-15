import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService
    ) { }

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    async get(@Param('userId', ParseUUIDPipe) userId: string) {
        return await this.wishlistService.getWishlistItems(userId);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createWishlistItemDto: CreateWishlistItemDto) {
        return await this.wishlistService.createWishlistItem(createWishlistItemDto);
    }

    @Delete('remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return await this.wishlistService.removeWishlistItem(id);
    }
}
