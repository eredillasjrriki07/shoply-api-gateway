import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviewService: ReviewsService
    ) { }

    @Get('product/:productId')
    @HttpCode(HttpStatus.OK)
    async getProductReviews(@Param('productId', ParseUUIDPipe) productId: string) {
        return await this.reviewService.getProductReviews(productId);
    }
}
