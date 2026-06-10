import { Review } from '@/modules/reviews/review.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewFilterDto } from './dto/review-filter.dto';
import { constants } from '@/common/util/constants';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>
    ) { }

    async getProductReviewSummary(productId: string) {
        const summary = await this.reviewRepo
            .createQueryBuilder('r')
            .select('COUNT(r.id)', 'totalReviews')
            .addSelect('AVG(r.rating)', 'averageRating')
            .addSelect('SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END)', 'fiveStar')
            .addSelect('SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END)', 'fourStar')
            .addSelect('SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END)', 'threeStar')
            .addSelect('SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END)', 'twoStar')
            .addSelect('SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END)', 'oneStar')
            .addSelect('ROUND(SUM(CASE WHEN r.rating >= 4 THEN 1 ELSE 0 END) / COUNT(r.id) * 100)', 'positivePercent')
            .addSelect('ROUND(SUM(CASE WHEN r.rating <= 2 THEN 1 ELSE 0 END) / COUNT(r.id) * 100)', 'negativePercent')
            .where('r.productId = :productId', { productId })
            .getRawOne();

        const latestReview = await this.reviewRepo.findOne({
            where: { productId },
            order: { createdAt: 'desc' },
            relations: { user: true },
            select: {
                user: {
                    createdAt: true,
                    firstName: true,
                    lastName: true,
                },
            },
        });

        return { summary, latestReview };
    }

    async getAllProductReviews(reviewFilterDto: ReviewFilterDto) {

        const [reviews, total] = await this.reviewRepo.findAndCount({
            where: { productId: reviewFilterDto.productId },
            relations: { user: true },
            select: {
                user: {
                    createdAt: true,
                    firstName: true,
                    lastName: true,
                }
            },
            order: { createdAt: 'desc' },
            skip: (reviewFilterDto.page! - 1) * constants.PAGE_LIMIT,
            take: constants.PAGE_LIMIT,
        });

        return { page: reviewFilterDto.page, count: total, reviews };
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
