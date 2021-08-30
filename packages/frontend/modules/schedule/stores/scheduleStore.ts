import { startOfDay } from "date-fns";
import { computed, observable } from "mobx";
import { ApiCollection } from "modules/network/types";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { ScheduleItem } from "../types";

export type SerializedScheduleStore = {
  items: ScheduleItem[];
};

export class ScheduleStore extends Store<SerializedScheduleStore> {
  @observable public selectedDate = startOfDay(new Date());
  @observable public items: ScheduleItem[] = [];

  public async fetch() {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    if (this.items.length > 0) return;

    const response = await api.get<ApiCollection<ScheduleItem>>("/scheduleitems", {
      params: {
        days: 1,
      },
    });

    this.items = response.data.results;
  }

  public serialize() {
    return {
      items: this.items,
    };
  }

  public hydrate(data: SerializedScheduleStore) {
    this.items = data.items;
  }

  @computed
  public get upcoming() {
    return this.items.filter((x) => new Date() < new Date(x.endtime)).slice(0, 4);
  }
}

export const scheduleStore = createStoreFactory(ScheduleStore);
