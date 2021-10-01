import { ResourceFetcher } from "modules/state/classes/ResourceFetcher";
import { ResourceStore, SerializedResourceStore } from "modules/state/classes/ResourceStore";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { createOrganization, OrganizationData } from "../resources/Organization";

export class OrganizationStore extends Store<SerializedResourceStore<OrganizationData>> {
  private store = new ResourceStore({
    manager: this.manager,
    getId: (d: OrganizationData) => d.id,
    createFetcher: (manager, fetch) => new ResourceFetcher({ createResource: createOrganization, fetch, manager }),
    createCanonicalFetchData: (d) => async () => {
      const { networkStore } = this.manager.stores;
      const { api } = networkStore;

      const { data } = await api.get<OrganizationData>(`/organization/${d.id}`);
      return data;
    },
  });

  public fetchById(id: number) {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    return this.store.getOrCreateById(id, async () => {
      const { data } = await api.get<OrganizationData>(`/organization/${id}`);
      return data;
    });
  }

  public serialize() {
    return this.store.serialize();
  }

  public hydrate(data: SerializedResourceStore<OrganizationData>) {
    this.store.hydrate(data);
  }

  public get getResourceById() {
    return this.store.getResourceById.bind(this.store);
  }

  public get add() {
    return this.store.prepopulate.bind(this.store);
  }
}

export const organizationStore = createStoreFactory(OrganizationStore);
