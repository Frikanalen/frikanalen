import { format, startOfDay } from "date-fns";
import { computed, observable } from "mobx";
import { ARTIFICIAL_DELAY } from "modules/core/constants";
import { wait } from "modules/lang/async";
import { ApiCollection } from "modules/network/types";
import { ResourceFetcher } from "modules/state/classes/ResourceFetcher";
import { ResourceStore, SerializedResourceStore } from "modules/state/classes/ResourceStore";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { createScheduleItem, ScheduleItemData } from "../resources/ScheduleItem";

export type SerializedScheduleStore = {
  store: SerializedResourceStore<ScheduleItemData>;
  latestItems: number[];
  itemsByDate: Record<string, number[]>;
};

export class ScheduleStore extends Store<SerializedScheduleStore> {
  private store = new ResourceStore({
    manager: this.manager,
    getId: (d: ScheduleItemData) => d.id,
    createFetcher: (manager, fetch) => new ResourceFetcher({ createResource: createScheduleItem, fetch, manager }),
    createCanonicalFetchData: (id) => async () => {
      const { networkStore } = this.manager.stores;
      const { api } = networkStore;

      const { data } = await api.get<ScheduleItemData>(`/scheduleitems/${id}`);
      return data;
    },
  });

  @observable public selectedDate = startOfDay(new Date());

  @observable public itemsByDate: Record<string, number[]> = {};
  @observable public latestItems: number[] = [];

  public async fetchLatest() {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    if (this.latestItems.length > 0) return;

    const response = await api.get<ApiCollection<ScheduleItemData>>("/scheduleitems", {
      params: {
        days: 1,
      },
    });

    this.latestItems = response.data.results.map((i) => this.store.add(i));
  }

  public async fetchByDate(date: Date) {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    const existingList = this.itemsByDate[date.toISOString()];
    if (existingList) return existingList;

    this.itemsByDate[date.toISOString()] = [];

    const [response] = await Promise.all([
      await api.get<ApiCollection<ScheduleItemData>>("/scheduleitems", {
        params: {
          days: 1,
          date: format(date, "yyyy-M-d"),
        },
      }),
      wait(ARTIFICIAL_DELAY),
    ]);

    this.itemsByDate[date.toISOString()] = response.data.results.map((i) => this.store.add(i));
  }

  public serialize() {
    return {
      latestItems: this.latestItems,
      itemsByDate: this.itemsByDate,
      store: this.store.serialize(),
    };
  }

  public hydrate(data: SerializedScheduleStore) {
    this.latestItems = data.latestItems;
    this.itemsByDate = data.itemsByDate;
    this.store.hydrate(data.store);
  }

  @computed
  public get selectedDateItems() {
    return (this.itemsByDate[this.selectedDate.toISOString()] ?? []).map((id) => this.store.getResourceById(id));
  }

  @computed
  public get upcoming() {
    return this.latestItems
      .map((id) => this.store.getResourceById(id))
      .filter((x) => new Date() < new Date(x.data.endtime))
      .slice(0, 4);
  }
}

export const scheduleStore = createStoreFactory(ScheduleStore);
