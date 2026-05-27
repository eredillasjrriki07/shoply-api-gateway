import { ProductStatus } from "@/common/enums/product-status.enum";
import { LessThanOrEqual, MoreThan } from "typeorm";

export const STATUS_FILTERS = {
    [ProductStatus.IN_STOCK]: MoreThan(5),
    [ProductStatus.LOW]: LessThanOrEqual(5),
    [ProductStatus.OUT_OF_STOCK]: 0,
};