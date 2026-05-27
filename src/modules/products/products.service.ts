import { STATUS_FILTERS } from '@/common/util/helper';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { ProductFilterDto } from '@/modules/products/dto/product-filter.dto';
import { ProductColor } from '@/modules/products/entities/product-color.entity';
import { ProductSize } from '@/modules/products/entities/product-size.entity';
import { ProductVariant } from '@/modules/products/entities/product-variant.entity';
import { ProductWithAggregates } from '@/modules/products/entities/product-with-aggregates.view';
import { Product } from '@/modules/products/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductWithAggregates)
        private readonly productsView: Repository<ProductWithAggregates>,
        private readonly dataSource: DataSource
    ) { }

    async getAllProducts(productFilterDto: ProductFilterDto) {

        const where: FindOptionsWhere<ProductWithAggregates> = {};
        if (productFilterDto.name) where.name = productFilterDto.name;
        if (productFilterDto.category) where.category = productFilterDto.category;
        if (productFilterDto.status) where.totalStock = STATUS_FILTERS[productFilterDto.status]

        const result = await this.productsView.find({ where });

        const products = this.getTransactionByPage(result, productFilterDto.page!);

        const response = { page: productFilterDto.page, products };

        return response;
    }

    async getProductWithId(id: string) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: {
                sizes: true,
                colors: true,
                productVariants: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found!`);
        }

        return product;
    }

    async createProduct(createProductDto: CreateProductDto) {
        const createdProduct = this.dataSource.transaction(async (manager) => {
            // Inserting to product table
            const product = await manager.save(Product, {
                name: createProductDto.name,
                imageUrl: createProductDto.imageUrl,
                category: createProductDto.category,
                price: createProductDto.price,
                oldPrice: createProductDto.oldPrice,
                description: createProductDto.description,
                isActive: createProductDto.isActive,
            });

            // Inserting to product_size table
            if (createProductDto.sizes?.length) {
                await manager.save(
                    ProductSize,
                    createProductDto.sizes.map((size) => ({ productId: product.id, value: size.value }))
                );
            }

            // Inserting to product_color table
            if (createProductDto.colors?.length) {
                await manager.save(
                    ProductColor,
                    createProductDto.colors.map((color) => ({ productId: product.id, value: color.value }))
                );
            }

            // Inserting to product_variant table
            if (createProductDto.variants?.length) {
                await manager.save(
                    ProductVariant,
                    createProductDto.variants.map((variant) => ({
                        productId: product.id,
                        sku: variant.sku,
                        size: variant.size,
                        color: variant.color,
                        priceOverride: variant.priceOverride,
                        stocks: variant.stocks,
                    }))
                );
            }

            return product;
        });

        return createdProduct;
    }

    private getTransactionByPage(data, page: number) {
        const pageLimit = 10;
        let start = (page - 1) * pageLimit;
        let end = start + pageLimit;
        return data.slice(start, end);
    }
}
