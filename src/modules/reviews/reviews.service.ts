import { ReviewFilterDto } from '@/modules/reviews/dto/review-filter.dto';
import { Review } from '@/modules/reviews/review.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>
    ) { }

    async getProductReviews(productId: string) {

        const reviews = await this.reviewRepo.find({ where: { productId } });

        return reviews;
    }

    // async getProductReviews(getReviewDto: ReviewFilterDto) {
    //     const { productId, userId, orderItemId } = getReviewDto;
    //     const where: FindOptionsWhere<Review> = { productId };

    //     if (!!userId !== !!orderItemId) {
    //         throw new BadRequestException('userId and orderItemId must be provided together.');
    //     } else {
    //         where.userId = userId;
    //         where.orderItemId = orderItemId;
    //     }

    //     const reviews = await this.reviewRepo.find({ where });

    //     return reviews;
    // }

}
