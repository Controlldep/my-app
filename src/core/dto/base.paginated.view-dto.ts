export abstract class PaginatedViewDto<T> {
  abstract items: T;
  totalCount: number;
  pageCount: number;
  page: number;
  pageSize: number;

  public static mapToView<T>(data: {
    items: T;
    totalCount: number;
    page: number;
    size: number;
  }): PaginatedViewDto<T> {
    return {
      totalCount: data.totalCount,
      pageCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      items: data.items,
    };
  }
}
