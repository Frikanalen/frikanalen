import { useEffect } from "react";

export const useWindowEvent = <T extends keyof WindowEventMap>(
  name: T,
  callback: (event: WindowEventMap[T]) => void
) => {
  useEffect(() => {
    window.addEventListener(name, callback);

    return () => {
      window.removeEventListener(name, callback);
    };
  });
};
