import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promo } from './promo.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { PromoFilterDto } from './dto/promo-filter.dto';
import { getTransactionByPage, sortBy } from '@/common/util/helper';

@Injectable()
export class PromosService {
    constructor(
        @InjectRepository(Promo)
        private readonly promoRepo: Repository<Promo>
    ) { }

    async getAll(promoFilterDto: PromoFilterDto) {
        const where: FindOptionsWhere<Promo> = {};
        if (promoFilterDto.code) where.code = promoFilterDto.code;

        const promos = await this.promoRepo.find({ where });

        const results = sortBy(getTransactionByPage(promos, promoFilterDto.page!), 'code', 'asc');

        const response = { page: promoFilterDto.page, promos: results };

        return response;
    }

    async create(createPromoDto: CreatePromoDto) {
        const newPromo = this.promoRepo.create(createPromoDto);

        return await this.promoRepo.save(newPromo);
    }

    async update(id: string, updatePromoDto: UpdatePromoDto) {
        const result = await this.promoRepo.update(id, updatePromoDto);

        if (result.affected === 0) throw new NotFoundException(`Promo with id ${id} not found.`);

        return this.promoRepo.findOneBy({ id });
    }

    async getPromoWithId(id: string) {
        const promo = await this.promoRepo.findOne({
            where: { id },
            relations: { orders: true }
        });

        if (!promo) throw new NotFoundException(`Promo with id ${id} not found.`);

        return promo;
    }
}
