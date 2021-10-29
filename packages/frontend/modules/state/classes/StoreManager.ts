import { Store } from "./Store";

export class StoreManager<T extends Record<string, Store>> {
  public stores: T = {} as any;
  public didInit = false;

  constructor(
    public instantiators: {
      [K in keyof T]: (manager: StoreManager<T>) => T[K];
    }
  ) {
    for (const [name, creator] of Object.entries(instantiators)) {
      const store = creator(this);
      store.make();

      this.stores[name as keyof T] = store;
    }
  }

  public async init() {
    await Promise.all(Object.values(this.stores).map((x) => x.init()));
    this.didInit = true;
  }

  public reset() {
    for (const store of Object.values(this.stores)) {
      if (store.reset) store.reset();
    }
  }

  public hydrate(data?: any) {
    if (!data) return;

    for (const [name, store] of Object.entries(this.stores)) {
      if (store.hydrate) store.hydrate(data[name]);
    }
  }

  public serialize() {
    const result: Record<string, any> = {};

    for (const [name, store] of Object.entries(this.stores)) {
      if (store.serialize) {
        result[name] = store.serialize();
      }
    }

    return result;
  }
}
