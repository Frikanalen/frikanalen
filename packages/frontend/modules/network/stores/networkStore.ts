import axios, { AxiosInstance } from "axios";
import configs from "components/configs";
import { IS_SERVER } from "modules/core/constants";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { NextPageContext } from "next";

export class NetworkStore extends Store {
  public incomingHeaders: Record<string, string> = {};
  private res: NextPageContext["res"];

  private hasCreated = false;
  private apiInstance?: AxiosInstance;

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

    const headers = IS_SERVER ? this.incomingHeaders : {};

    this.apiInstance = this.addInterceptors(
      axios.create({
        baseURL: configs.api,
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
}

export const networkStore = createStoreFactory(NetworkStore);
