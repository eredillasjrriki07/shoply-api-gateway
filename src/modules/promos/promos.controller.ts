import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PromosService } from './promos.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { PromoFilterDto } from './dto/promo-filter.dto';

@Controller('promos')
@UseGuards(JwtAuthGuard)
export class PromosController {
    constructor(
        private readonly promoService: PromosService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async get(@Query() promotFilterDto: PromoFilterDto) {
        return await this.promoService.getAll(promotFilterDto);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPromoDto: CreatePromoDto) {
        return await this.promoService.create(createPromoDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getWithId(@Param('id') id: string) {
        return await this.promoService.getPromoWithId(id);
    }

    @Patch('update/:id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updatePromoDto: UpdatePromoDto) {
        return await this.promoService.update(id, updatePromoDto);
    }
}
