import { authStore, AuthStore } from "modules/auth/stores/authStore";
import { ModalStore, modalStore } from "modules/modal/stores/modalStore";
import { NetworkStore, networkStore } from "modules/network/stores/networkStore";
import { organizationStore, OrganizationStore } from "modules/organization/stores/organizationStore";
import { PopoverStore, popoverStore } from "modules/popover/stores/popoverStore";
import { ScheduleStore, scheduleStore } from "modules/schedule/stores/scheduleStore";
import { VideoStore, videoStore } from "modules/video/stores/videoStore";
import { VideoUploadStore, videoUploadStore } from "modules/video/stores/videoUploadStore";
import { listStore, ListStore } from "./stores/listStore";
import { StoreFactories } from "./types";

export type Stores = {
  authStore: AuthStore;
  listStore: ListStore;
  videoStore: VideoStore;
  modalStore: ModalStore;
  networkStore: NetworkStore;
  popoverStore: PopoverStore;
  scheduleStore: ScheduleStore;
  videoUploadStore: VideoUploadStore;
  organizationStore: OrganizationStore;
};

export const stores: StoreFactories = {
  authStore,
  listStore,
  videoStore,
  modalStore,
  popoverStore,
  networkStore,
  scheduleStore,
  videoUploadStore,
  organizationStore,
};
