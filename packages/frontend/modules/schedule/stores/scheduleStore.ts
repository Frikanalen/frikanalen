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
  @observable public latestItems: ScheduleItem[] = [];

  public async fetchLatest() {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    if (this.latestItems.length > 0) return;

    const response = await api.get<ApiCollection<ScheduleItem>>("/scheduleitems", {
      params: {
        days: 1,
      },
    });

    this.latestItems = response.data.results;
  }

  public serialize() {
    return {
      items: this.latestItems,
    };
  }

  public hydrate(data: SerializedScheduleStore) {
    this.latestItems = data.items;
  }

  @computed
  public get upcoming() {
    return this.latestItems.filter((x) => new Date() < new Date(x.endtime)).slice(0, 4);
  }
}

export const scheduleStore = createStoreFactory(ScheduleStore);
