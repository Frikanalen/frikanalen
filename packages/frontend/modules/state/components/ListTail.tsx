import { useCallback } from "react";
import { ScrollTrigger, ScrollTriggerProps } from "modules/ui/components/ScrollTrigger";
import { List } from "../classes/List";

export type ListTailProps = {
  list: List<any, any>;
} & Omit<ScrollTriggerProps, "onTrigger">;

export function ListTail(props: ListTailProps) {
  const { list, ...rest } = props;

  const safelyFetch = useCallback(
    async (recheck: () => void) => {
      if (list.status === "idle" && list.hasMore) {
        await list.more();
        recheck();
      }
    },
    [list]
  );

  return <ScrollTrigger onTrigger={safelyFetch} {...rest} />;
}
