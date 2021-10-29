import axios, { AxiosInstance } from "axios";
import configs from "../config";
import { IS_SERVER } from "modules/core/constants";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { NextPageContext } from "next";
import cookie from "cookie";
import { THE_END_OF_TIMES } from "../constants";

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

  public setCookie(key: string, value: string, path = "/") {
    const serialized = cookie.serialize(key, value);
    const safeValue = `${serialized}; path=${path}; expires=${THE_END_OF_TIMES}; samesite=lax`;

    if (!IS_SERVER) {
      document.cookie = safeValue;
    }
  }

  public getCookie(key: string): string | undefined {
    const parsed = cookie.parse(this.cookieString);
    return parsed[key];
  }

  private createInstances() {
    if (this.hasCreated) return;

    const csrf = IS_SERVER ? undefined : this.getCookie("csrftoken");
    const headers = IS_SERVER ? this.incomingHeaders : { "X-CSRFToken": csrf || "" };

    this.apiInstance = this.addInterceptors(
      axios.create({
        baseURL: configs.api,
        withCredentials: true,
        headers, // FIXME: JUST TO GET BUILD RUNNING
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
    if (this.req && IS_SERVER) {
      return (this.req.headers["cookie"] as string) ?? "";
    }

    if (!IS_SERVER) {
      return document.cookie;
    }

    return "";
  }
}

export const networkStore = createStoreFactory(NetworkStore);
