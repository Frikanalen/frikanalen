import { observable } from "mobx";
import { Manager } from "../types";
import { Resource } from "./Resource";
import { FetchData, ResourceFetcher } from "./ResourceFetcher";

export type ResourceStoreOptions<R extends Resource<D>, D> = {
  createFetcher: (manager: Manager, fetch: FetchData<D>) => ResourceFetcher<R, D>;
  createCanonicalFetchData: (data: D) => FetchData<D>;
  getId: (data: D) => number;
  manager: Manager;
};

export type SerializedResourceStore<D> = {
  items: D[];
};

export class ResourceStore<R extends Resource<D>, D> {
  @observable private items: Record<number, ResourceFetcher<R, D>> = {};

  constructor(private options: ResourceStoreOptions<R, D>) {}

  public getOrCreateById(id: number, fetchData: () => Promise<D>) {
    const { manager, createFetcher } = this.options;

    const existingFetcher = this.items[id];
    if (existingFetcher) return existingFetcher;

    const newFetcher = createFetcher(manager, fetchData);
    this.items[id] = newFetcher;

    return newFetcher;
  }

  public prepopulate(data: D) {
    const { getId, createCanonicalFetchData } = this.options;

    const id = getId(data);
    const existing = this.getOrCreateById(id, createCanonicalFetchData(data));

    existing.populate(data);
    return existing;
  }

  public serialize(): SerializedResourceStore<D> {
    const items = Object.entries(this.items)
      .filter(([, r]) => r.resource)
      .map(([, r]) => r.resource!.data);
    return { items };
  }

  public hydrate(data: SerializedResourceStore<D>) {
    for (const item of data.items) {
      this.prepopulate(item);
    }
  }
}
