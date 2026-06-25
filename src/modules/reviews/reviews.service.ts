import { Review } from '@/modules/reviews/review.entity';
import { Injectable, Logger } from '@nestjs/common';
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

    private readonly logger = new Logger(ReviewsService.name);

    async getProductReviewSummary(productId: string) {
        this.logger.log(`Getting review summary for product with id ${productId}`);

        let summary = await this.reviewRepo
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

        this.logger.log(`Found ${summary.totalReviews} reviews.`);

        this.logger.log(`Getting latest review for product with id ${productId}`);

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

        if (latestReview) {
            this.logger.log(`Found latest review with id ${latestReview.id}`);
        }

        // Converting all values to number
        summary = Object.fromEntries(
            Object.entries(summary ?? {}).map(([key, value]) => [key, Number(value)]),
        );

        return { summary, latestReview };
    }

    async getAllProductReviews(reviewFilterDto: ReviewFilterDto) {
        this.logger.log(`Fetching all reviews for product with id ${reviewFilterDto.productId}`);

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

        this.logger.log(`Found ${total} reviews.`);

        return { page: reviewFilterDto.page, count: total, reviews };
    }
}
