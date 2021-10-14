import axios, { AxiosInstance } from "axios";
import configs from "../config";
import { IS_SERVER } from "modules/core/constants";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { NextPageContext } from "next";
import Cookies from "js-cookie";

export class NetworkStore extends Store {
  public incomingHeaders: Record<string, string> = {};
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

  public setResponseObject(res: NextPageContext["res"]) {
    this.res = res;
  }

  private createInstances() {
    if (this.hasCreated) return;

    const csrf = IS_SERVER ? undefined : Cookies.get("csrftoken");
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
}

export const networkStore = createStoreFactory(NetworkStore);
