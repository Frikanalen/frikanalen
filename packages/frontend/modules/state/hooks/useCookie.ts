import { useEffect, useState } from "react";
import { useStores } from "../manager";
import { CookieType } from "../stores/cookieStore";

export const useCookie = <T extends string>(key: CookieType, initial: T) => {
  const { cookieStore } = useStores();
  const [state, setState] = useState<T>(() => (cookieStore.get(key) as T) ?? initial);

  useEffect(() => {
    cookieStore.set(key, state);
  }, [state, key, cookieStore]);

  return [state, setState] as const;
};
