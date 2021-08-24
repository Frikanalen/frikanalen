import { Stores } from "./stores";
import { StoreManager } from "./classes/StoreManager";

export type Manager = StoreManager<Stores>;

export type StoreFactories = {
  [K in keyof Stores]: (manager: Manager) => Stores[K];
};
