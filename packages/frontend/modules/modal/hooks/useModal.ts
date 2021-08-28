import { useContext } from "react";
import { modalContext } from "../contexts";

export const useModal = () => {
  const context = useContext(modalContext);

  if (!context) {
    throw new Error("useModal() called outside modal context");
  }

  return context;
};
