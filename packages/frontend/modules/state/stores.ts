import { authStore, AuthStore } from "modules/auth/stores/authStore";
import { ScheduleStore, scheduleStore } from "modules/schedule/stores/scheduleStore";
import { StoreFactories } from "./types";

export type Stores = {
  authStore: AuthStore;
  scheduleStore: ScheduleStore;
};

export const stores: StoreFactories = {
  authStore,
  scheduleStore,
};
