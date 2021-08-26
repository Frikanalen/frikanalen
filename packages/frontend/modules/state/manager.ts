import { IS_SERVER } from "modules/core/constants";
import React, { useContext } from "react";
import { StoreManager } from "./classes/StoreManager";
import { stores } from "./stores";
import { Manager } from "./types";

let manager: Manager;

const createManager = () => new StoreManager(stores);

export const getManager = (hydrationData?: object) => {
  if (IS_SERVER) {
    const ssrManager = createManager();
    ssrManager.hydrate(hydrationData);

    return ssrManager;
  }

  if (!manager) {
    const clientManager = createManager();
    clientManager.hydrate(hydrationData);

    manager = clientManager;
  }

  return manager;
};

export const ManagerContext = React.createContext<Manager | undefined>(undefined);

export const useStores = () => {
  const manager = useContext(ManagerContext);

  if (!manager) {
    throw new Error("Manager not passed to context provider!");
  }

  return manager.stores;
};
