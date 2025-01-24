export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  constructor() {
    this.result = {} as T;
    this.pagination = {} as Pagination;
  }
  result: T;
  pagination: Pagination;
}
