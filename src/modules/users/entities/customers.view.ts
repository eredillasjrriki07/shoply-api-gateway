import { numericTransformer } from "@/common/util/helper";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('customer_overview')
export class CustomersView {
    @ViewColumn()
    id: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    email: string;

    @ViewColumn()
    joined: Date;

    @ViewColumn({ transformer: numericTransformer })
    orders: number;

    @ViewColumn({ transformer: numericTransformer })
    spent: number;
}