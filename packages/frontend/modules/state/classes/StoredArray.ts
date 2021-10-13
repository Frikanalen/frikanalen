import { StoredValue } from "./StoredValue";

type StorageItem<D> = {
  key: string;
  data: D;
};

/** Stores structured data in localStorage */
export class StoredArray<D> {
  private limit: number;
  private storage: StoredValue<StorageItem<D>[]>;
  private items: StorageItem<D>[] = [];

  public constructor(name: string, limit = 50) {
    this.limit = limit;
    this.storage = new StoredValue(name, []);
    this.restore();
  }

  public set(key: string, data: D): void {
    const index = this.items.findIndex((x) => x.key === key);
    const exists = index !== -1;

    if (exists) {
      this.items[index].data = data;
    } else {
      this.items.push({ key, data });
    }

    this.cleanup();
    this.save();
  }

  public get(key: string): D | undefined {
    const item = this.items.find((x) => x.key === key);

    if (!item) return;
    return item.data;
  }

  public remove(key: string) {
    this.items = this.items.filter((x) => x.key !== key);
  }

  private cleanup() {
    const exceeds = this.items.length > this.limit;
    if (exceeds) this.items.shift();
  }

  private async restore() {
    const data = await this.storage.restore();
    if (!data) return;

    this.items = data;
  }

  private async save() {
    await this.storage.save(this.items);
  }
}
