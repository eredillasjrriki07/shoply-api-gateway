import { constants } from '@/common/util/constants';
import { STATUS_FILTERS } from '@/common/util/helper';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { ProductFilterDto } from '@/modules/products/dto/product-filter.dto';
import { UpdateProductDto } from '@/modules/products/dto/update-product.dto';
import { ProductColor } from '@/modules/products/entities/product-color.entity';
import { ProductSize } from '@/modules/products/entities/product-size.entity';
import { ProductVariant } from '@/modules/products/entities/product-variant.entity';
import { ProductWithAggregates } from '@/modules/products/entities/product-with-aggregates.view';
import { Product } from '@/modules/products/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductStatus } from '@/common/enums/product-status.enum';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly productVariantRepo: Repository<ProductVariant>,
        @InjectRepository(ProductWithAggregates)
        private readonly productsView: Repository<ProductWithAggregates>,
        private readonly dataSource: DataSource
    ) { }

    async getAllProducts(productFilterDto: ProductFilterDto) {

        const where: FindOptionsWhere<ProductWithAggregates> = {};
        if (productFilterDto.name) where.name = productFilterDto.name;
        if (productFilterDto.category) where.category = productFilterDto.category;
        if (productFilterDto.status) where.totalStock = STATUS_FILTERS[productFilterDto.status]

        const products = await this.productsView.find({
            where,
            order: { createdAt: 'desc' },
            skip: (productFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        const response = { page: productFilterDto.page, products };

        return response;
    }

    async getProductWithId(id: string) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: {
                sizes: true,
                colors: true,
                productVariants: true
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

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        const result = await this.productRepo.update(id, updateProductDto);

        if (result.affected === 0) {
            throw new NotFoundException(`Product with id ${id} not found.`);
        }

        return this.productRepo.findOneBy({ id });
    }

    async getProductCount() {
        return await this.productRepo.count();
    }

    async getTopProducts(date: Date) {
        const topProducts = (await this.productRepo
            .createQueryBuilder('p')
            .select('p.name', 'name')
            .addSelect('COALESCE(SUM(oi.quantity), 0)', 'sold')
            .leftJoin('product_variant', 'pv', 'pv.product_id = p.id')
            .leftJoin('order_item', 'oi', 'oi.variant_id = pv.id AND oi.created_at >= :date', { date })
            .groupBy('p.id')
            .orderBy('sold', 'DESC')
            .limit(5)
            .getRawMany()).map(topProduct => ({ ...topProduct, sold: Number(topProduct.sold) }));

        return topProducts;
    }

    async getInventoryStats() {
        const inventory = await this.productsView
            .createQueryBuilder('p')
            .select('COUNT(p.id)', 'products')
            .addSelect('COALESCE(SUM(p.total_stock), 0)', 'totalUnits')
            .addSelect('SUM(CASE WHEN p.total_stock > 0 AND p.total_stock <= 3 THEN 1 ELSE 0 END)', 'lowStock')
            .addSelect('SUM(CASE WHEN p.total_stock = 0 THEN 1 ELSE 0 END)', 'outOfStock')
            .getRawOne();

        // Parsing result to number 
        const response = Object.fromEntries(
            Object.entries(inventory).map(([k, v]) => [k, Number(v)])
        );

        return response;
    }

    async updateProductVariant(id: string, updateProductVariantDto: UpdateProductVariantDto) {
        const result = await this.productVariantRepo.update(id, updateProductVariantDto);

        if (result.affected === 0) {
            throw new NotFoundException(`Product with id ${id} not found.`);
        }

        return this.productVariantRepo.findOneBy({ id });
    }

    async getLowAndOutOfStockProducts() {
        const products = (await this.productsView.find({
            where: [
                { totalStock: LessThanOrEqual(5) },
                { totalStock: 0 }
            ],
            select: {
                id: true,
                name: true,
                category: true,
                totalStock: true,
            },
        })).map(product => ({ ...product, status: product.totalStock === 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.LOW }));

        return products;
    }

    async productVariantExists(id: string) {
        const exists = await this.productVariantRepo.exists({ where: { id } });
        return exists;
    }

    async productExists(id: string) {
        const exists = await this.productRepo.exists({ where: { id } });
        return exists;
    }
}
