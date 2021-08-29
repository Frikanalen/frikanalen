import { Popover } from "../types/Popover";

import React, { useLayoutEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { useObserver } from "mobx-react-lite";
import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";
import { popoverContext, PopoverContext } from "../contexts";

export type PopoverItemProps = {
  popover: Popover;
};

const Container = styled.div`
  z-index: 1;
`;

export function PopoverItem(props: PopoverItemProps) {
  const { popover } = props;
  const { popoverStore } = useStores();

  const ref = useRef<HTMLDivElement>(null);
  const context: PopoverContext = {
    popover,
    dismiss: () => popoverStore.dismiss(popover.name),
  };

  useLayoutEffect(() => {
    const { current: element } = ref;
    const { anchor } = popover;

    if (!element) return;

    const popper = createPopper(anchor, element, {
      placement: popover.placement,
      modifiers: [
        {
          name: "flip",
          options: {
            padding: 64,
          },
        },
      ],
    });

    return () => popper.destroy();
  });

  return useObserver(() => (
    <Container ref={ref}>
      <popoverContext.Provider value={context}>{popover.render()}</popoverContext.Provider>
    </Container>
  ));
}
