import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { ProductFilterDto } from '@/modules/products/dto/product-filter.dto';
import { ProductsService } from '@/modules/products/products.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(
        private readonly productService: ProductsService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async products(@Query() productFilterDto: ProductFilterDto) {
        return await this.productService.getAllProducts(productFilterDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async productWithId(@Param('id') id: string) {
        return this.productService.getProductWithId(id);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productService.createProduct(createProductDto);
    }
}
