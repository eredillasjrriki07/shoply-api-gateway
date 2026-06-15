import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,
        private readonly productService: ProductsService,
        private readonly userService: UsersService
    ) { }

    private readonly logger = new Logger(CartService.name);

    async getCartItems(userId: string) {
        this.logger.log(`Getting cart items for user id ${userId}`);

        const cartItems = await this.cartItemRepo.find({
            where: { userId },
            relations: { variant: { product: true } },
            select: {
                variant: {
                    id: true,
                    size: true,
                    color: true,
                    priceOverride: true,
                    product: {
                        price: true
                    },
                },
            },
        });

        this.logger.log(`Found ${cartItems.length} cart items for user ${userId}`);

        return cartItems;
    }

    async createCartItem(createCartItemDto: CreateCartItemDto) {
        const { userId, variantId } = createCartItemDto;

        this.logger.log(`Creating cart item for user ${userId} with variant ${variantId}`);

        // Check if userId exists, throw exception is inside the invoked method
        await this.userService.findById(userId);

        // Check if given product variant id exists
        const productVariantExists = await this.productService.productVariantExists(variantId);

        if (!productVariantExists) {
            this.logger.warn(`Product variant with id ${variantId} not found!`);
            throw new NotFoundException(`Product variant with id ${variantId} not found!`);
        }

        const cartItem = this.cartItemRepo.create(createCartItemDto);

        const savedCartItem = await this.cartItemRepo.save(cartItem);

        this.logger.log(`Cart item ${savedCartItem.id} created.`);

        return savedCartItem;
    }

    async updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto) {
        this.logger.log(`Updating cart item ${id}...`);
        const result = await this.cartItemRepo.update(id, updateCartItemDto);

        if (result.affected === 0) {
            this.logger.warn(`Cart item with id ${id} not found.`);
            throw new NotFoundException(`Cart item with id ${id} not found.`);
        }

        const updated = await this.cartItemRepo.findOneBy({ id });

        this.logger.log(`Updated cart item ${updated?.id}`);

        return updated;
    }

    async removeCartItem(id: string) {
        this.logger.log(`Removing cart item ${id}...`);

        const result = await this.cartItemRepo.delete(id);

        if (result.affected === 0) {
            this.logger.warn('Cart item not found!');
            throw new NotFoundException('Cart item not found!');
        }

        this.logger.log(`Cart item ${id} removed.`);
    }
}
