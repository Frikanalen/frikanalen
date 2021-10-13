import { Popover } from "../types/Popover";

import React, { useLayoutEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { useObserver } from "mobx-react-lite";
import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";
import { popoverContext, PopoverContext } from "../contexts";
import { TransitionStatus } from "react-transition-group";
import { css, keyframes } from "@emotion/react";

export type PopoverItemProps = {
  transitionStatus: TransitionStatus;
  popover: Popover;
};

const ContainerAnimation = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const Container = styled.div<{ status: TransitionStatus }>`
  z-index: 1;

  ${(props) => {
    if (props.status === "entering")
      return css`
        animation: ${ContainerAnimation} 150ms linear forwards;
      `;

    if (props.status === "exiting") {
      return css`
        animation: ${ContainerAnimation} 150ms linear forwards reverse;
      `;
    }
  }}
`;

export function PopoverItem(props: PopoverItemProps) {
  const { popover, transitionStatus } = props;
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
    <Container status={transitionStatus} ref={ref}>
      <popoverContext.Provider value={context}>{popover.render()}</popoverContext.Provider>
    </Container>
  ));
}
