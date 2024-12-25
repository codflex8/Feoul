export class GenericResponse<T extends object> {
  public pages: number;
  constructor(
    private page: number,
    private pageSize: number,
    private count: number,
    private items: T[]
  ) {
    const size = pageSize ?? 10;
    this.page = page ? page : 1;
    this.pageSize = Number(size);
    this.count = count;
    this.pages = Math.ceil(count / size);
    this.items = items;
  }
}
