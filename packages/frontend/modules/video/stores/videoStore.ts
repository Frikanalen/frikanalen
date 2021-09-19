import { Resource } from "modules/state/classes/Resource";
import { ResourceStore, SerializedResourceStore } from "modules/state/classes/ResourceStore";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { Video } from "../types";

export class VideoStore extends Store<SerializedResourceStore<Video>> {
  private store = new ResourceStore({
    createResource: () => new Resource<Video>(),
    getId: (d: Video) => d.id,
  });

  public fetchById(id: number) {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    return this.store.fetch(id, async () => {
      const { data } = await api.get<Video>(`/videos/${id}`);
      return data;
    });
  }

  public serialize() {
    return this.store.serialize();
  }

  public hydrate(data: SerializedResourceStore<Video>) {
    this.store.hydrate(data);
  }
}

export const videoStore = createStoreFactory(VideoStore);
