import { numericTransformer } from "@/common/util/helper";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity("products_with_aggregates")
export class ProductWithAggregates {
    @ViewColumn()
    id: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    category: string;

    @ViewColumn({ transformer: numericTransformer })
    price: number;

    @ViewColumn({
        name: 'old_price',
        transformer: numericTransformer
    })
    oldPrice: number;

    @ViewColumn({
        name: 'image_url'
    })
    imageUrl: string | null;

    @ViewColumn({
        name: 'is_active',
        transformer: { from: (v) => Boolean(v), to: (v) => v },
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
        name: 'total_stock',
        transformer: numericTransformer
    })
    totalStock: number;

    @ViewColumn({
        name: 'avg_rating',
        transformer: numericTransformer
    })
    rating: number;
}