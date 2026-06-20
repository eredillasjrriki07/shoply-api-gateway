import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewFilterDto } from './dto/review-filter.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviewService: ReviewsService
    ) { }

    @Get('product/summary/:productId')
    @HttpCode(HttpStatus.OK)
    async getProductReviewSummary(@Param('productId', ParseUUIDPipe) productId: string) {
        return await this.reviewService.getProductReviewSummary(productId);
    }

    @Get('product')
    @HttpCode(HttpStatus.OK)
    async getAllProductReviews(@Query() reviewFilterDto: ReviewFilterDto) {
        return await this.reviewService.getAllProductReviews(reviewFilterDto);
    }
}
