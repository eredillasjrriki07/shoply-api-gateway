import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity("products_with_aggregates")
export class ProductWithAggregates {
    @ViewColumn()
    id: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    category: string;

    @ViewColumn()
    price: number;

    @ViewColumn({
        name: 'old_price'
    })
    oldPrice: number;

    @ViewColumn({
        name: 'image_url'
    })
    imageUrl: string | null;

    @ViewColumn({
        name: 'is_active'
    })
    isActive: boolean;

    @ViewColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @ViewColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @ViewColumn({
        name: 'total_stock'
    })
    totalStock: number;
}