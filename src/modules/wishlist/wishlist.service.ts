import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    private readonly logger = new Logger(WishlistService.name);

    async getWishlistItems(userId: string) {
        this.logger.log(`Fetching wishlist for user ${userId}`);

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

        this.logger.log(`Found ${wishlistItems.length} wishlist items.`);

        return wishlistItems;
    }

    async createWishlistItem(createWishlistItemDto: CreateWishlistItemDto) {
        const { productId, userId } = createWishlistItemDto;

        this.logger.log(`Creating wishlist item for user ${userId} with product id ${productId}`);

        // Check first if given product variant id exists
        const productExists = await this.productService.productExists(productId);

        if (!productExists) {
            this.logger.warn(`Product with id ${productId} not found!`);
            throw new NotFoundException(`Product with id ${productId} not found!`);
        }

        const wishlistItem = this.wishlistItemRepo.create(createWishlistItemDto);

        const savedWishlistItem = await this.wishlistItemRepo.save(wishlistItem);

        this.logger.log(`Successfully created wishlist item with id ${savedWishlistItem.id}`);

        return savedWishlistItem;
    }

    async removeWishlistItem(id: string) {
        this.logger.log(`Removing wishlist item with id ${id}`);
        const result = await this.wishlistItemRepo.delete(id);
        if (result.affected === 0) {
            this.logger.warn('Wishlist item not found!');
            throw new NotFoundException('Wishlist item not found!');
        }
    }
}