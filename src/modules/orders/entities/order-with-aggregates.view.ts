import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('orders_with_aggregates')
export class OrderWithAggregates {
    @ViewColumn()
    id: string;

    @ViewColumn({ name: 'order_number' })
    orderNumber: string;

    @ViewColumn({ name: 'customer_name' })
    customerName: string;

    @ViewColumn({ name: 'customer_email' })
    customerEmail: string;

    @ViewColumn()
    status: string;

    @ViewColumn()
    date: Date;

    @ViewColumn({ name: 'total_items' })
    items: number;

    @ViewColumn()
    total: number;
}