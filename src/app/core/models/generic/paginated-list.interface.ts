export interface IPaginatedList<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
