import { startOfDay } from "date-fns";
import { computed, observable } from "mobx";
import { ApiCollection } from "modules/network/types";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { ScheduleItem } from "../types";

export type SerializedScheduleStore = {
  latestItems: ScheduleItem[];
  itemsByDate: Record<string, ScheduleItem[]>;
};

export class ScheduleStore extends Store<SerializedScheduleStore> {
  @observable public selectedDate = startOfDay(new Date());

  @observable public itemsByDate: Record<string, ScheduleItem[]> = {};
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

  public async fetchByDate(date: Date) {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    const existingList = this.itemsByDate[date.toISOString()];
    if (existingList) return existingList;

    this.itemsByDate[date.toISOString()] = [];

    const response = await api.get<ApiCollection<ScheduleItem>>("/scheduleitems", {
      params: {
        days: 1,
        date: date.toISOString(),
      },
    });

    this.itemsByDate[date.toISOString()] = response.data.results;
  }

  public serialize() {
    return {
      latestItems: this.latestItems,
      itemsByDate: this.itemsByDate,
    };
  }

  public hydrate(data: SerializedScheduleStore) {
    this.latestItems = data.latestItems;
    this.itemsByDate = data.itemsByDate;
  }

  @computed
  public get selectedDateItems() {
    return this.itemsByDate[this.selectedDate.toISOString()] ?? [];
  }

  @computed
  public get upcoming() {
    return this.latestItems.filter((x) => new Date() < new Date(x.endtime)).slice(0, 4);
  }
}

export const scheduleStore = createStoreFactory(ScheduleStore);
