import { Resource } from "modules/state/classes/Resource";
import { ResourceStore } from "modules/state/classes/ResourceStore";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { Video } from "../types";

export type SerializedVideoStore = {
  videos: Record<number, Video>;
};

export class VideoStore extends Store<SerializedVideoStore> {
  private store = new ResourceStore({
    createResource: () => new Resource<Video>(),
    getId: (d: Video) => d.id,
  });

  public async fetchById(id: number) {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    return this.store.fetch(id, async () => {
      const { data } = await api.get<Video>(`/videos/${id}`, {
        // THIS IS TEMPORARY
        baseURL: "https://frikanalen.no/api/",
        withCredentials: false,
      });
      return data;
    });
  }
}

export const videoStore = createStoreFactory(VideoStore);
