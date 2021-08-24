import { observable } from "mobx";
import { api } from "modules/network";
import { ApiCollection } from "modules/network/types";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { ScheduleItem } from "../types";

export class ScheduleStore extends Store {
  @observable public items: ScheduleItem[] = [];

  public async fetch() {
    const response = await api.get<ApiCollection<ScheduleItem>>("/scheduleitems", {
      params: {
        days: 1,
      },
    });

    this.items = response.data.results;
  }
}

export const scheduleStore = createStoreFactory(ScheduleStore);
