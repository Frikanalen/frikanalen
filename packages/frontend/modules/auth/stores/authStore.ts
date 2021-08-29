import { AxiosError } from "axios";
import { computed, observable } from "mobx";
import { api } from "modules/network";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { User } from "modules/user/schemas";

export class AuthStore extends Store {
  @observable user?: User;

  public async authenticate() {
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
