import { Between, LessThanOrEqual, MoreThanOrEqual, FindOperator } from "typeorm";

export function filterByDateRange(
    fromDate?: Date | string,
    toDate?: Date | string,
): FindOperator<Date> | undefined {
    const start = fromDate ? new Date(fromDate) : undefined;
    const end = toDate ? new Date(new Date(toDate).getTime() + 1) : undefined;

    if (start && end) return Between(start, end);
    if (start) return MoreThanOrEqual(start);
    if (end) return LessThanOrEqual(end);
    return undefined;
}