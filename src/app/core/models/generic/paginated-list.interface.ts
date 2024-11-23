import { IPaginatedFilter } from "./paginated-filter.interface";

export interface IPaginatedList<T> extends IPaginatedFilter {
    items: T[];
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}