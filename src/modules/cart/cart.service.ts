import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,
        private readonly productService: ProductsService
    ) { }

    async getCartItems(userId: string) {
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

        return cartItems;
    }

    async createCartItem(createCartItemDto: CreateCartItemDto) {

        // Check first if given product variant id exists
        const { variantId } = createCartItemDto;

        const productVariantExists = await this.productService.productVariantExists(variantId);

        if (!productVariantExists) throw new NotFoundException(`Product variant with id ${variantId} not found!`);

        const cartItem = this.cartItemRepo.create(createCartItemDto);

        return await this.cartItemRepo.save(cartItem);
    }

    async updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto) {
        const result = await this.cartItemRepo.update(id, updateCartItemDto);

        if (result.affected === 0) throw new NotFoundException(`Cart item with id ${id} not found.`);

        return this.cartItemRepo.findOneBy({ id });
    }

    async removeCartItem(id: string) {
        const result = await this.cartItemRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Cart item not found!');
    }
}
