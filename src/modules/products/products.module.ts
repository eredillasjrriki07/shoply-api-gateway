import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { ProductSize } from '@/modules/products/entities/product-size.entity';
import { ProductColor } from '@/modules/products/entities/product-color.entity';
import { ProductVariant } from '@/modules/products/entities/product-variant.entity';
import { ProductWithAggregates } from '@/modules/products/entities/product-with-aggregates.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductSize,
      ProductColor,
      ProductVariant,
      ProductWithAggregates
    ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }
