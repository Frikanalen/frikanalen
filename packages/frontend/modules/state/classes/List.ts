import { action, makeObservable, observable } from "mobx";

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

export type SerializedInfiniteList<T, P extends object> = {
  items: T[];
  hasMore: boolean;
  limit: number;
  offset: number;
  params: Partial<P>;
};

export class List<T, P extends object> {
  public status: ListStatus = "idle";
  public items: T[] = [];
  public hasMore = true;

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

    makeObservable(this, {
      status: observable,
      items: observable,
      hasMore: observable,

      more: action,
    });
  }

  public async more() {
    if (this.status === "fetching" || !this.hasMore) {
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

  public serialize(): SerializedInfiniteList<T, P> {
    return {
      items: this.items,
      offset: this.offset,
      params: this.params,
      hasMore: this.hasMore,
      limit: this.limit,
    };
  }

  public hydrate(data: SerializedInfiniteList<T, P>) {
    for (const [key, value] of Object.entries(data)) {
      //@ts-ignore
      this[key] = value;
    }
  }
}
