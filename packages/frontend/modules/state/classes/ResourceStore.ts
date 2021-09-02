import { observable } from "mobx";
import { Resource } from "./Resource";

export type ResourceStoreOptions<R extends Resource<D>, D> = {
  createResource: () => R;
  getId: (data: D) => number;
};

export type SerializedResourceStore<D> = {
  items: Record<number, D>;
};

export class ResourceStore<R extends Resource<D>, D> {
  @observable private items: Record<number, R> = {};

  constructor(private options: ResourceStoreOptions<R, D>) {}

  public getOrCreateById(id: number) {
    const existingResource = this.items[id];
    if (existingResource) return existingResource;

    const newResource = this.options.createResource();
    this.items[id] = newResource;

    return newResource;
  }

  public prepopulate(data: D) {
    const id = this.options.getId(data);
    const existing = this.getOrCreateById(id);

    existing.populate(data);
    return existing;
  }

  public fetch(id: number, doFetch: () => Promise<D>) {
    const resource = this.getOrCreateById(id);

    const internalFetch = async () => {
      if (resource.fetching) return;
      resource.fetching = true;

      try {
        const result = await doFetch();

        resource.populate(result);
      } catch (e) {
        resource.error = e;
      }

      resource.hasFetched = true;
      resource.fetching = false;
    };

    const promise = internalFetch();
    return { resource, promise };
  }

  public serialize(): SerializedResourceStore<D> {
    // Object.entries returns a record with string index, so :any this for now
    const items: any = Object.fromEntries(Object.entries(this.items).filter(([, r]) => r.hasData));
    return { items };
  }

  public hydrate(data: SerializedResourceStore<D>) {
    for (const item of Object.values(data.items)) {
      this.prepopulate(item);
    }
  }
}
