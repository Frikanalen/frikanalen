import { AxiosError } from "axios";
import { computed, observable } from "mobx";
import { api } from "modules/network";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { StoredValue } from "modules/state/classes/StoredValue";
import { User } from "modules/user/schemas";

// TODO: FIX THIS AS SOON AS POSSIBlE. LOCAL STORAGE IS NOT SAFE FOR AUTH TOKENS.
const unsafeLocalStorageHack = new StoredValue<string | undefined>("token", undefined);

export class AuthStore extends Store {
  @observable user?: User;

  public async authenticate() {
    try {
      const response = await api.get<User>("/user");

      this.user = response.data;
    } catch (error) {
      const { response } = error as AxiosError;

      if (response?.status === 401) {
        // TODO: Handle invalid token
        return;
      }

      throw error;
    }
  }

  @computed
  public get isAuthenticated() {
    return !!this.user;
  }
}

export const authStore = createStoreFactory(AuthStore);
