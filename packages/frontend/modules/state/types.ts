import { Stores } from "./stores";
import { StoreManager } from "./classes/StoreManager";
import { List } from "./classes/List";

export type Manager = StoreManager<Stores>;

export type StoreFactories = {
  [K in keyof Stores]: (manager: Manager) => Stores[K];
};

export type ListFactory<D extends object, P extends object> = (data: D, manager: Manager) => List<any, P>;
