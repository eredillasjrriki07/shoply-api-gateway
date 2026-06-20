import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promo } from './promo.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { PromoFilterDto } from './dto/promo-filter.dto';
import { constants } from '@/common/util/constants';

@Injectable()
export class PromosService {
    constructor(
        @InjectRepository(Promo)
        private readonly promoRepo: Repository<Promo>
    ) { }

    private readonly logger = new Logger(PromosService.name);

    async getAll(promoFilterDto: PromoFilterDto) {
        const where: FindOptionsWhere<Promo> = {};
        if (promoFilterDto.code) where.code = promoFilterDto.code;

        this.logger.log(`Fetchiing promos with filter ${JSON.stringify(where)}`);

        const promos = await this.promoRepo.find({
            where,
            order: { code: 'asc' },
            skip: (promoFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        this.logger.log(`Found ${promos.length} promos. Page ${promoFilterDto.page}`);

        const response = { page: promoFilterDto.page, promos };

        return response;
    }

    async create(createPromoDto: CreatePromoDto) {
        try {
            this.logger.log(`Creating promo...`);

            const newPromo = this.promoRepo.create(createPromoDto);

            const savedNewPromo = await this.promoRepo.save(newPromo);

            this.logger.log(`Successfully created promo with id ${savedNewPromo.id}`);

            return savedNewPromo;
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException('Unknown error occured.');
        }
    }

    async update(id: string, updatePromoDto: UpdatePromoDto) {
        this.logger.log(`Updating promo with id ${id}`);

        const result = await this.promoRepo.update(id, updatePromoDto);

        if (result.affected === 0) {
            this.logger.warn(`Promo with id ${id} not found.`);
            throw new NotFoundException(`Promo with id ${id} not found.`);
        }

        const updated = await this.promoRepo.findOneBy({ id });

        this.logger.log(`Successfully updated promo with id ${updated!.id}`);

        return updated;
    }

    async getPromoWithId(id: string) {
        this.logger.log(`Fetching promo with id ${id}`);

        const promo = await this.promoRepo.findOne({
            where: { id },
            relations: { orders: true }
        });

        if (!promo) {
            this.logger.warn(`Promo with id ${id} not found.`);
            throw new NotFoundException(`Promo with id ${id} not found.`);
        }

        this.logger.log(`Fetched promo with id ${id}`);

        return promo;
    }
}
