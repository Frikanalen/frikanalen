import { createStoreFactory, Store } from "../classes/Store";

// DO NOT EVER PUT "sessionid" HERE. THIS IS FOR STATE, NOT AUTHENTICATION.
const EXPOSED_COOKIES = ["theme"] as const;

export type CookieType = typeof EXPOSED_COOKIES[number];

export type SerializedCookieStore = {
  cookies: Partial<Record<CookieType, string>>;
};

export class CookieStore extends Store<SerializedCookieStore> {
  private cookies: Partial<Record<CookieType, string>> = {};

  public init() {
    const { networkStore } = this.manager.stores;

    for (const name of EXPOSED_COOKIES) {
      const value = networkStore.getCookie(name);
      if (!value) continue;

      this.cookies[name] = value;
    }
  }

  public get(key: CookieType) {
    return this.cookies[key];
  }

  public set(key: CookieType, value: string, path = "/") {
    this.cookies[key] = value;

    const { networkStore } = this.manager.stores;
    networkStore.setCookie(key, value, path);
  }

  public serialize() {
    const { cookies } = this;
    return { cookies };
  }

  public hydrate(data: SerializedCookieStore) {
    this.cookies = data.cookies;
  }
}

export const cookieStore = createStoreFactory(CookieStore);
