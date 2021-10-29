import { Manager } from "../types";

export class Store<T = any> {
  constructor(protected manager: Manager) {}

  // Constructor-like method without need for super
  public make(): void {}

  public init(): void | Promise<void> {}
  public reset?(): void;
  public hydrate?(data: T): void;
  public serialize?(): T;
}

export const createStoreFactory =
  <S extends Store>(storeClass: new (manager: Manager) => S) =>
  (manager: Manager) =>
    new storeClass(manager);
