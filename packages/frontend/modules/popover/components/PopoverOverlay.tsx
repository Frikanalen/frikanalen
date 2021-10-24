import React, { useRef, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";
import { Transition, TransitionGroup } from "react-transition-group";
import { PopoverItem } from "./PopoverItem";

const Container = styled.div``;

export function PopoverOverlay() {
  const { popoverStore } = useStores();
  const ref = useRef<HTMLDivElement>(null);

  const popoversCount = useObserver(() => popoverStore.popovers.length);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { current: container } = ref;
      const popover = popoverStore.popovers[0];

      const isWithinContainer = container && container.contains(event.target as any);
      const isAnchor = event.target === popover.anchor || popover.anchor.contains(event.target as any);

      if (!isWithinContainer && !isAnchor && popover?.autoDismiss) {
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
      <TransitionGroup>
        {popoverStore.popovers.map((popover) => (
          <Transition mountOnEnter timeout={150} key={popover.name}>
            {(status) => <PopoverItem transitionStatus={status} key={popover.name} popover={popover} />}
          </Transition>
        ))}
      </TransitionGroup>
    </Container>
  ));
}
