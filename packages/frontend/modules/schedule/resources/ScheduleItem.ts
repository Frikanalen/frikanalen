import { Resource, ResourceFactory } from "modules/state/classes/Resource";
import { Manager } from "modules/state/types";
import { VideoData } from "modules/video/types";

export type ScheduleItemData = {
  id: number;
  video: VideoData;
  starttime: string;
  endtime: string;
};

export class ScheduleItem extends Resource<ScheduleItemData> {
  constructor(data: ScheduleItemData, manager: Manager) {
    super(data, manager);

    const { videoStore } = this.manager.stores;
    videoStore.add(data.video);
  }

  public get video() {
    const { videoStore } = this.manager.stores;
    return videoStore.getResourceById(this.data.video.id);
  }
}

export const createScheduleItem: ResourceFactory<ScheduleItem> = (data, manager) => new ScheduleItem(data, manager);
