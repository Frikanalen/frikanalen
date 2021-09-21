import { observable } from "mobx";
import { Manager } from "../types";

/** Represents a resource containing data that may be fetched later, or that can fail */
export class Resource<D> {
  public data: D;
  public rawData: D;

  public constructor(data: D, protected manager: Manager) {
    this.data = observable(data);
    this.rawData = data;
  }

  public populate(newData: Partial<D>) {
    this.data = { ...this.data, ...newData };
    this.rawData = { ...this.rawData, ...newData };
    this.onData();
  }

  protected onData() {}
}

export type ResourceFactory<R extends Resource<any>> = (data: R["data"], manager: Manager) => R;
