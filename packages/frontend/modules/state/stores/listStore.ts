import { List } from "../classes/List";
import { createStoreFactory, Store } from "../classes/Store";
import { lists, ListType } from "../lists";

export type SerializedListEntry = {
  type: ListType;
  list: any;
  data: any;
};

export type StoredListEntry = {
  type: ListType;
  list: List<any, any>;
  data: any;
};

export type SerializedListStore = {
  lists: Record<string, SerializedListEntry>;
};

export class ListStore extends Store<SerializedListStore> {
  private lists: Record<string, StoredListEntry> = {};

  // TODO: Fix "data" being any here. Somehow extract the correct type infornmation?
  public ensure(name: string, type: ListType, data: any) {
    const existing = this.lists[name];
    if (existing) return existing.list;

    const list = lists[type](data, this.manager);
    this.lists[name] = { type, list, data };

    return list;
  }

  public serialize() {
    const entries: Record<string, SerializedListEntry> = {};

    for (const [key, entry] of Object.entries(this.lists)) {
      entries[key] = {
        type: entry.type,
        data: entry.data,
        list: entry.list.serialize(),
      };
    }

    return { lists: entries };
  }

  public hydrate(data: SerializedListStore) {
    for (const [key, entry] of Object.entries(data.lists)) {
      const list = lists[entry.type](entry.data, this.manager);
      list.hydrate(entry.list);

      this.lists[key] = {
        type: entry.type,
        data: entry.data,
        list,
      };
    }
  }
}

export const listStore = createStoreFactory(ListStore);
