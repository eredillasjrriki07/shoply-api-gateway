import { Injectable, UseGuards } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { DayRange } from '@/common/enums/day-range.enum';

@Injectable()
@UseGuards(JwtAuthGuard)
export class DashboardService {
    constructor(
        private readonly productService: ProductsService,
        private readonly orderService: OrdersService,
        private readonly userService: UsersService,
    ) { }

    async getStats(dayRange: string) {

        const dayMap: Record<DayRange, number> = {
            [DayRange.SEVEN_DAYS]: 7,
            [DayRange.THIRTY_DAYS]: 30,
            [DayRange.NINETY_DAYS]: 90,
        };

        // Setting days range for where condition
        const date = new Date();
        date.setDate(date.getDate() - dayMap[dayRange]);

        // Get product count
        const productCount = await this.productService.getProductCount();

        // Get order count
        const orderCount = await this.orderService.getOrderCount(date);

        // Get customer count
        const customerCount = await this.userService.getCustomerCount();

        // Get revenue
        const revenue = await this.orderService.getRevenue(date);

        // Get order status counts
        const statusCounts = await this.orderService.getOrderStatusCounts(date);

        // Get top 5 products
        const topProducts = await this.productService.getTopProducts(date);

        // Get recent orders
        const recentOrders = await this.orderService.getRecentOrders();

        // Get low and out of stocks products
        const lowStockProducts = await this.productService.getLowAndOutOfStockProducts();

        return {
            products: productCount,
            orders: orderCount,
            customers: customerCount,
            revenue,
            statusCounts,
            topProducts,
            recentOrders,
            lowStockProducts
        };
    }
}
