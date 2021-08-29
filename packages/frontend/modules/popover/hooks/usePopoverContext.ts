import { useContext } from "react";
import { popoverContext } from "../contexts";

export const usePopoverContext = () => {
  const context = useContext(popoverContext);

  if (!context) {
    throw new Error("usePopoverContext() called outside popover context");
  }

  return context;
};
