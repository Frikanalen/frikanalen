import { AxiosError } from "axios";
import { computed, observable } from "mobx";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { User } from "modules/user/schemas";

export type SerializedAuthStore = {
  user?: User;
};

export class AuthStore extends Store<SerializedAuthStore> {
  @observable user?: User;

  public serialize() {
    return { user: this.user };
  }

  public hydrate(data: SerializedAuthStore) {
    this.user = data.user;
  }

  public async authenticate() {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    try {
      const response = await api.get<User>("/user");

      this.user = response.data;
    } catch (error) {
      const { response } = error as AxiosError;

      // Not logged in
      if (response?.status === 401) {
        return;
      }
    }
  }

  public async logout() {
    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    try {
      await api.post("/user/logout");
      this.user = undefined;
    } catch (e) {}
  }

  @computed
  public get isAuthenticated() {
    return !!this.user;
  }
}

export const authStore = createStoreFactory(AuthStore);
