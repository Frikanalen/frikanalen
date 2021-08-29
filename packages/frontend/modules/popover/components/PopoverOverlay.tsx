import React, { useRef, useEffect } from "react";
import { PopoverItem } from "./PopoverItem";
import { useObserver } from "mobx-react-lite";
import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";

const Container = styled.div``;

export function PopoverOverlay() {
  const { popoverStore } = useStores();
  const ref = useRef<HTMLDivElement>(null);

  const popoversCount = useObserver(() => popoverStore.popovers.length);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { current: container } = ref;
      const popover = popoverStore.popovers[0];

      if (container && !container.contains(event.target as any) && popover?.autoDismiss) {
        popoverStore.dismiss(popover.name);
      }
    };

    if (popoversCount > 0) {
      window.addEventListener("click", handleClick);
    }

    return () => window.removeEventListener("click", handleClick);
  }, [popoversCount, popoverStore]);

  return useObserver(() => (
    <Container ref={ref}>
      {popoverStore.popovers.map((popover) => (
        <PopoverItem key={popover.name} popover={popover} />
      ))}
    </Container>
  ));
}
