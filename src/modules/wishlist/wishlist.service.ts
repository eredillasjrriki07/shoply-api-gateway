import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { Repository } from 'typeorm';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(WishlistItem)
        private readonly wishlistItemRepo: Repository<WishlistItem>,
        private readonly productService: ProductsService
    ) { }

    async getWishlistItems(userId: string) {
        const wishlistItems = await this.wishlistItemRepo.find({
            where: { userId },
            relations: { product: true },
            select: {
                product: {
                    id: true,
                    imageUrl: true,
                    name: true,
                    price: true,
                    oldPrice: true
                },
            }
        });
        return wishlistItems;
    }

    async createWishlistItem(createWishlistItemDto: CreateWishlistItemDto) {
        // Check first if given product variant id exists
        const { productId } = createWishlistItemDto;

        const productExists = await this.productService.productExists(productId);

        if (!productExists) throw new NotFoundException(`Product with id ${productId} not found!`);

        const wishlistItem = this.wishlistItemRepo.create(createWishlistItemDto);

        return await this.wishlistItemRepo.save(wishlistItem);
    }

    async removeWishlistItem(id: string) {
        const result = await this.wishlistItemRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Wishlist item not found!');
    }
}