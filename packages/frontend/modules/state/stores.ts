import { authStore, AuthStore } from "modules/auth/stores/authStore";
import { ModalStore, modalStore } from "modules/modal/stores/modalStore";
import { ScheduleStore, scheduleStore } from "modules/schedule/stores/scheduleStore";
import { StoreFactories } from "./types";

export type Stores = {
  authStore: AuthStore;
  modalStore: ModalStore;
  scheduleStore: ScheduleStore;
};

export const stores: StoreFactories = {
  authStore,
  modalStore,
  scheduleStore,
};
