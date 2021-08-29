import { RefObject, useState, useEffect, useCallback } from "react";
import { Placement } from "@popperjs/core";
import { getHash } from "modules/lang/string";
import { useStores } from "modules/state/manager";

export type UsePopoverOptions = {
  ref: RefObject<HTMLElement>;
  render: () => React.ReactNode;
  placement?: Placement;
  autoDismiss?: boolean;
};

export const usePopover = (options: UsePopoverOptions) => {
  const { ref, render, autoDismiss = true, placement = "auto" } = options;
  const [name] = useState(() => getHash(8));

  const { popoverStore } = useStores();
  const [popoverName, setPopoverName] = useState("");

  const spawn = () => {
    const { current: anchor } = ref;
    if (!anchor || popoverName) return;

    popoverStore.spawn({
      onDismiss: () => setPopoverName(""),
      autoDismiss,
      placement,
      render,
      anchor,
      name,
    });

    setPopoverName(name);
  };

  const dismiss = useCallback(() => {
    if (popoverName) {
      popoverStore.dismiss(popoverName);
      setPopoverName("");
    }
  }, [popoverName, popoverStore]);

  const toggle = () => {
    // Only spawn the popover,
    // let the popover overlay
    // handle dismissing on click
    if (!popoverName) {
      spawn();
    }
  };

  useEffect(() => {
    if (popoverName) {
      popoverStore.update(popoverName, { render });
    }
  }, [render, popoverStore, popoverName]);

  useEffect(() => {
    return () => {
      dismiss();
    };
  }, [dismiss]);

  return {
    active: !!popoverName,
    dismiss,
    toggle,
    spawn,
  };
};
