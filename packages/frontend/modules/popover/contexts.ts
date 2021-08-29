import React from "react";
import { Popover } from "./types/Popover";

export type PopoverContext = {
  dismiss: () => void;
  popover: Popover;
};

export const popoverContext = React.createContext<PopoverContext | undefined>(undefined);
