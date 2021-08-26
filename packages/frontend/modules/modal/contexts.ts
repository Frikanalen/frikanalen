import { createContext } from "react";

export type ModalContextValue = {
  close: () => void;
  dismiss: () => void;
};

export const modalContext = createContext<ModalContextValue | undefined>(undefined);
