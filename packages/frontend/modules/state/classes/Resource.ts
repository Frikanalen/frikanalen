import { computed, observable } from "mobx";

/** Represents a resource containing data that may be fetched later, or that can fail */
export class Resource<T> {
  @observable private _data?: T;
  @observable public error?: any;

  @observable public hasFetched = false;
  @observable public fetching = false;

  @computed
  public get data() {
    if (!this._data) {
      throw new Error("Attempt to access data before data is present");
    }

    return this._data;
  }

  @computed
  public get ready() {
    if (this.fetching || !this.hasFetched) {
      return false;
    }

    return true;
  }

  public populate(data: T) {
    this._data = data;
  }
}
