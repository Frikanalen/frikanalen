import { observable } from "mobx";

export type ListStatus = "idle" | "fetching" | "failed";

export type ListFetchResult<T> = {
  newItems: T[];
  newOffset: number;
  hasMore: boolean;
};

export type ListFetchOptions<P extends object> = {
  offset: number;
  limit: number;
  params: Partial<P>;
};

export type ListFetch<T, P extends object> = (options: ListFetchOptions<P>) => Promise<ListFetchResult<T>>;

export type ListOptions<T, P extends object> = {
  fetch: ListFetch<T, P>;
  initialOffset?: number;
  initialParams?: Partial<P>;
  limit?: number;
};

export class List<T, P extends object> {
  @observable public status: ListStatus = "idle";
  @observable public items: T[] = [];
  @observable public hasMore = true;

  private limit: number;
  private offset: number;
  private params: Partial<P>;
  private fetch: ListFetch<T, P>;

  constructor(options: ListOptions<T, P>) {
    const { initialOffset = 0, limit = 5, initialParams = {}, fetch } = options;

    this.offset = initialOffset;
    this.params = initialParams;
    this.limit = limit;
    this.fetch = fetch;
  }

  public async more() {
    if (this.status === "fetching") {
      return;
    }

    const { offset, limit, params } = this;

    try {
      const result = await this.fetch({ offset, limit, params });

      this.items.push(...result.newItems);
      this.offset = result.newOffset;
      this.hasMore = result.hasMore;

      this.status = "idle";
    } catch {
      this.status = "failed";
    }
  }
}
