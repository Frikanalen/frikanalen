import axios, { AxiosInstance } from "axios";
import configs from "../config";
import { IS_SERVER } from "modules/core/constants";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { NextPageContext } from "next";
import cookie from "cookie";

export class NetworkStore extends Store {
  public incomingHeaders: Record<string, string> = {};

  private req: NextPageContext["req"];
  private res: NextPageContext["res"];

  private hasCreated = false;
  private apiInstance?: AxiosInstance;
  private uploadInstance?: AxiosInstance;

  private addInterceptors(instance: AxiosInstance) {
    if (IS_SERVER) {
      instance.interceptors.response.use((response) => {
        const { headers } = response;
        const setCookie = headers["set-cookie"];

        if (setCookie) {
          this.res?.setHeader("set-cookie", setCookie);
        }

        return response;
      });
    }

    return instance;
  }

  public setHTTPObjects(res: NextPageContext["res"], req: NextPageContext["req"]) {
    this.res = res;
    this.req = req;
  }

  public setCookie(key: string, value: string) {
    const serialized = cookie.serialize(key, value);
    const newCookieString = [...this.cookieString.split("; "), serialized].join("; ");

    this.cookieString = newCookieString;
  }

  public getCookie(key: string): string | undefined {
    const parsed = cookie.parse(this.cookieString);
    return parsed[key];
  }

  private createInstances() {
    if (this.hasCreated) return;

    const csrf = IS_SERVER ? undefined : this.getCookie("csrftoken");
    const headers = IS_SERVER ? this.incomingHeaders : { "X-CSRFToken": csrf };

    this.apiInstance = this.addInterceptors(
      axios.create({
        baseURL: configs.api,
        withCredentials: true,
        headers,
      })
    );

    this.uploadInstance = this.addInterceptors(
      axios.create({
        baseURL: configs.upload,
        withCredentials: true,
        headers,
      })
    );

    this.hasCreated = true;
  }

  public get api() {
    this.createInstances();
    return this.apiInstance!;
  }

  public get upload() {
    this.createInstances();
    return this.uploadInstance!;
  }

  public get cookieString() {
    return IS_SERVER ? (this.req!.headers["Cookie"] as string) ?? "" : document.cookie;
  }

  public set cookieString(v: string) {
    if (IS_SERVER) return;
    document.cookie = v;
  }
}

export const networkStore = createStoreFactory(NetworkStore);
