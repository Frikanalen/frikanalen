import { authStore, AuthStore } from "modules/auth/stores/authStore";
import { ModalStore, modalStore } from "modules/modal/stores/modalStore";
import { NetworkStore, networkStore } from "modules/network/stores/networkStore";
import { PopoverStore, popoverStore } from "modules/popover/stores/popoverStore";
import { ScheduleStore, scheduleStore } from "modules/schedule/stores/scheduleStore";
import { VideoStore, videoStore } from "modules/video/stores/videoStore";
import { StoreFactories } from "./types";

export type Stores = {
  authStore: AuthStore;
  videoStore: VideoStore;
  modalStore: ModalStore;
  networkStore: NetworkStore;
  popoverStore: PopoverStore;
  scheduleStore: ScheduleStore;
};

export const stores: StoreFactories = {
  authStore,
  videoStore,
  modalStore,
  popoverStore,
  networkStore,
  scheduleStore,
};
