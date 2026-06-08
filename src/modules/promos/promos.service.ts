import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promo } from './promo.entity';
import { Repository } from 'typeorm';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';

@Injectable()
export class PromosService {
    constructor(
        @InjectRepository(Promo)
        private readonly promoRepo: Repository<Promo>
    ) { }

    async getAll(){
        return await this.promoRepo.find();
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
