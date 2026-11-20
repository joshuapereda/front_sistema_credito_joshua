export interface PageableRequest<T> {
  pageSize: number;
  pageNumber: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  criterials?: T | null;
  filterValue?: string | null;
}

export interface PageableResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
