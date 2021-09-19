import { observable } from "mobx";
import { Manager } from "../types";
import { Resource, ResourceFactory } from "./Resource";

export type FetchData<D> = () => Promise<D>;

export type ResourceFetcherOptions<R extends Resource<D>, D> = {
  createResource: ResourceFactory<R>;
  fetch: FetchData<D>;
  manager: Manager;
};

export class ResourceFetcher<R extends Resource<D>, D> {
  @observable public fetching = false;
  @observable public error?: any;

  @observable public resource?: R;

  public constructor(private options: ResourceFetcherOptions<R, D>) {}

  public populate(data: D) {
    const { resource, options } = this;
    const { createResource, manager } = options;

    if (resource) {
      resource.populate(data);
      return resource;
    }

    return (this.resource = createResource(data, manager));
  }

  public async fetch() {
    const { options } = this;
    this.fetching = true;

    try {
      const data = await options.fetch();

      this.fetching = false;
      this.populate(data);
    } catch (e) {
      this.error = e;
    }
  }
}
