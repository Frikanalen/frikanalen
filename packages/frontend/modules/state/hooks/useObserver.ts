import { autorun } from "mobx";
import { useEffect, useState } from "react";

export const useObserver = <T>(fn: () => T) => {
  const [value, setValue] = useState(fn());

  useEffect(() => {
    return autorun(() => {
      setValue(fn());
    });
  }, []);

  return value;
};
