import { makeObservable, observable } from "mobx";
import { Manager } from "../types";
import { Resource } from "./Resource";
import { FetchData, ResourceFetcher, SerializedResourceFetcher } from "./ResourceFetcher";

export type ResourceStoreOptions<R extends Resource<D>, D> = {
  createFetcher: (manager: Manager, fetch: FetchData<D>) => ResourceFetcher<R, D>;
  createCanonicalFetchData: (id: number) => FetchData<D>;
  getId: (data: D) => number;
  manager: Manager;
};

export type SerializedResourceStore<D> = {
  items: Record<number, SerializedResourceFetcher<D>>;
};

export class ResourceStore<R extends Resource<D>, D> {
  private items: Record<number, ResourceFetcher<R, D>> = {};

  constructor(private options: ResourceStoreOptions<R, D>) {
    makeObservable<ResourceStore<R, D>, "items">(this, {
      items: observable,
    });
  }

  public getOrCreateById(id: number, fetchData: () => Promise<D>) {
    const { manager, createFetcher } = this.options;

    const existingFetcher = this.items[id];
    if (existingFetcher) return existingFetcher;

    const newFetcher = createFetcher(manager, fetchData);
    this.items[id] = newFetcher;

    return newFetcher;
  }

  public getById(id: number) {
    const item = this.items[id];

    if (!item) {
      throw new Error(`Passed invalid id ${id} to getById`);
    }

    return item;
  }

  public getResourceById(id: number) {
    const item = this.getById(id);
    return item.resource!;
  }

  public add(data: D) {
    const fetcher = this.prepopulate(data);
    return this.options.getId(fetcher.resource!.data);
  }

  public prepopulate(data: D) {
    const { getId, createCanonicalFetchData } = this.options;

    const id = getId(data);
    const existing = this.getOrCreateById(id, createCanonicalFetchData(id));

    existing.populate(data);
    return existing;
  }

  public serialize(): SerializedResourceStore<D> {
    return { items: Object.fromEntries(Object.entries(this.items).map(([id, r]) => [id, r.serialize()])) };
  }

  public hydrate(data: SerializedResourceStore<D>) {
    const { createCanonicalFetchData } = this.options;

    for (const [id, item] of Object.entries(data.items)) {
      const safeId = Number(id);
      const fetcher = this.getOrCreateById(safeId, createCanonicalFetchData(safeId));

      fetcher.hydrate(item);
    }
  }
}
