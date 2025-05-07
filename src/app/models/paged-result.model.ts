export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }