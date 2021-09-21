import { Resource, ResourceFactory } from "modules/state/classes/Resource";
import { VideoData } from "../types";

export class Video extends Resource<VideoData> {
  protected onData() {
    const { organization } = this.data;
    const { organizationStore } = this.manager.stores;

    organizationStore.add(organization);
  }

  public get organization() {
    const { organizationStore } = this.manager.stores;
    return organizationStore.getById(this.data.organization.id);
  }
}

export const createVideo: ResourceFactory<Video> = (data, manager) => new Video(data, manager);
