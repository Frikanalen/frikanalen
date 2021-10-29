import { action, makeObservable, observable } from "mobx";
import { ErrorType, interpretError } from "../helpers/interpretError";
import { Manager } from "../types";
import { Resource, ResourceFactory } from "./Resource";

export type FetchData<D> = () => Promise<D>;

export type SerializedResourceFetcher<D> = {
  error?: ErrorType;
  data?: D;
};

export type ResourceFetcherOptions<R extends Resource<D>, D> = {
  createResource: ResourceFactory<R>;
  fetch: FetchData<D>;
  manager: Manager;
};

export class ResourceFetcher<R extends Resource<D>, D> {
  public fetching = false;
  public error?: ErrorType;
  public resource?: R;

  public constructor(private options: ResourceFetcherOptions<R, D>) {
    makeObservable(this, {
      fetching: observable,
      error: observable,
      resource: observable,

      populate: action,
      fetch: action,
    });
  }

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
      this.error = interpretError(e);
    }
  }

  public serialize(): SerializedResourceFetcher<D> {
    const { resource, error } = this;
    const data = resource?.data;

    return { data, error };
  }

  public hydrate(d: SerializedResourceFetcher<D>) {
    const { data, error } = d;

    if (data) {
      this.populate(data);
    }

    this.error = error;
  }
}
