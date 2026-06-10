import { Controller, Get, HttpCode, HttpStatus, ParseEnumPipe, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DayRange } from '@/common/enums/day-range.enum';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async stats(@Query('range', new ParseEnumPipe(DayRange)) range: string) {
        return await this.dashboardService.getStats(range);
    }
}
