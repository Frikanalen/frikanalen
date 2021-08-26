import { IS_SERVER } from "modules/core/constants";

export type StorageLike = {
  setItem: (key: string, value: any) => any;
  getItem: (key: string) => any;
  removeItem: (key: string) => any;
};

/** Mock server storage that does nothing */
export const serverStorage = {
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {},
};

export const defaultStorage = IS_SERVER ? serverStorage : localStorage;

/** Class which represents a value to be saved/restored */
export class StoredValue<T> {
  private storage: StorageLike;
  private key: string;
  private defaultValue: T;
  private hasRestored: boolean;

  /**
   * @param key The key used to store and restore the value
   * @param storage The storage interface used to store it, defaults to localStorage
   */
  constructor(key: string, defaultValue: T, storage: StorageLike = defaultStorage) {
    this.hasRestored = false;
    this.storage = storage;
    this.key = key;
    this.defaultValue = defaultValue;
  }

  public save(value: T) {
    if (!this.hasRestored) return;
    this.storage.setItem(this.key, this.serializeValue(value));
  }

  public restore(): T {
    this.hasRestored = true;
    const storedValue = this.storage.getItem(this.key);

    if (!storedValue) return this.defaultValue;
    return this.parseValue(storedValue);
  }

  public delete() {
    this.storage.removeItem(this.key);
  }

  private serializeValue(value: any) {
    return JSON.stringify(value);
  }

  private parseValue(value: any) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
