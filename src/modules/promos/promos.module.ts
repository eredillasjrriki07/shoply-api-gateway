import { Module } from '@nestjs/common';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './promo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promo
    ])
  ],
  controllers: [PromosController],
  providers: [PromosService],
  exports: [PromosService]
})
export class PromosModule { }
