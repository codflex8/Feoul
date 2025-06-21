export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  count: number;
  items: T[];
  pages: number;
}
