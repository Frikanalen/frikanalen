import { ResourceFetcher } from "modules/state/classes/ResourceFetcher";
import { ResourceStore, SerializedResourceStore } from "modules/state/classes/ResourceStore";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { createVideo } from "../resources/Video";
import { VideoData } from "../types";

export class VideoStore extends Store<SerializedResourceStore<VideoData>> {
  private store = new ResourceStore({
    manager: this.manager,
    getId: (d: VideoData) => d.id,
    createFetcher: (manager, fetch) => new ResourceFetcher({ createResource: createVideo, fetch, manager }),
    createCanonicalFetchData: (id) => async () => {
      const { networkStore } = this.manager.stores;
      const { api } = networkStore;

      const { data } = await api.get<VideoData>(`/videos/${id}`);
      return data;
    },
  });

  public fetchById(id: number) {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    return this.store.getOrCreateById(id, async () => {
      const { data } = await api.get<VideoData>(`/videos/${id}`);
      return data;
    });
  }

  public serialize() {
    return this.store.serialize();
  }

  public hydrate(data: SerializedResourceStore<VideoData>) {
    this.store.hydrate(data);
  }

  public get getResourceById() {
    return this.store.getResourceById.bind(this.store);
  }

  public get add() {
    return this.store.add.bind(this.store);
  }
}

export const videoStore = createStoreFactory(VideoStore);
