import { OrderEventType } from "@/common/enums/order-event-type.enum";
import { OrderStatus } from "@/common/enums/order-status.enum";
import { ProductStatus } from "@/common/enums/product-status.enum";
import { LessThanOrEqual, MoreThan } from "typeorm";

export const STATUS_FILTERS = {
    [ProductStatus.IN_STOCK]: MoreThan(5),
    [ProductStatus.LOW]: LessThanOrEqual(5),
    [ProductStatus.OUT_OF_STOCK]: 0,
};

export const statusMap = {
    [OrderEventType.PLACED]: OrderStatus.PLACED,
    [OrderEventType.TO_SHIP]: OrderStatus.TO_SHIP,
    [OrderEventType.CANCELLED]: OrderStatus.CANCELLED,
    [OrderEventType.SHIPPED]: OrderStatus.TO_RECEIVE,
    [OrderEventType.DELIVERED]: OrderStatus.COMPLETED,
    [OrderEventType.RETURN_REFUND]: OrderStatus.RETURN_OR_REFUND,
};

export const getTransactionByPage = (data, page: number) => {
    const pageLimit = 10;
    let start = (page - 1) * pageLimit;
    let end = start + pageLimit;
    return data.slice(start, end);
}

export const sortBy = <T>(data: T[], field: keyof T, order: 'asc' | 'desc' = 'desc') => {
    return [...data].sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

export const getSumAndCount = (data) => {
    const sum = Number(data.reduce((acc, currValue) => acc + currValue.total, 0));
    let count = data.length;
    return { sum, count };
}

export const numericTransformer = {
    from: (value: string | number): number => Number(value),
    to: (value: number): number => value,
};