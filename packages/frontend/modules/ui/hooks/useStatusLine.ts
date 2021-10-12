import { getUniqueId } from "modules/state/helpers/getUniqueId";
import { useCallback, useMemo, useState } from "react";
import { StatusType } from "../components/StatusLine";

export const useStatusLine = () => {
  const [status, setStatus] = useState<[StatusType, string, number]>(["info", "", 0]);

  const set = useCallback((type: StatusType, message: string) => {
    setStatus([type, message, getUniqueId()]);
  }, []);

  const [type, message, fingerprint] = status;

  const props = useMemo(() => {
    return { type, message, fingerprint };
  }, [type, message, fingerprint]);

  return [props, set] as const;
};
