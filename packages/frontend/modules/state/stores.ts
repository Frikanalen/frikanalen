import { ScheduleStore, scheduleStore } from "modules/schedule/stores/scheduleStore";
import { StoreFactories } from "./types";

export type Stores = {
  scheduleStore: ScheduleStore;
};

export const stores: StoreFactories = {
  scheduleStore,
};
