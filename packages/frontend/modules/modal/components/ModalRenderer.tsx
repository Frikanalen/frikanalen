import React from "react";

import { ModalItem } from "../stores/modalStore";
import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";
import { modalContext } from "../contexts";
import { css, keyframes } from "@emotion/react";
import { TransitionStatus } from "react-transition-group";

const { Provider } = modalContext;

export type ModalRendererProps = {
  transitionStatus: TransitionStatus;
  item: ModalItem;
};

const ContainerAnimation = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const ContentAnimation = keyframes`
  0% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
`;

const Container = styled.div<{ status: TransitionStatus }>`
  position: fixed;
  z-index: 5;

  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;

  background: ${(props) => props.theme.color.overlay};

  display: flex;
  align-items: center;
  justify-content: center;

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

const Content = styled.div<{ status: TransitionStatus }>`
  max-width: 100vw;

  ${(props) => {
    if (props.status === "entering")
      return css`
        animation: ${ContentAnimation} 150ms ease forwards;
      `;

    if (props.status === "exiting") {
      return css`
        animation: ${ContentAnimation} 150ms ease forwards reverse;
      `;
    }
  }}
`;

export function ModalRenderer(props: ModalRendererProps) {
  const { render, clickout, dismissOnClickout, key } = props.item;
  const { modalStore } = useStores();

  const context = {
    dismiss: () => modalStore.dismiss(key, true),
    close: () => modalStore.dismiss(key),
  };

  const onClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && clickout) {
      if (dismissOnClickout) {
        context.dismiss();
      } else {
        context.close();
      }
    }
  };

  return (
    <Container status={props.transitionStatus} onClick={onClick}>
      <Content status={props.transitionStatus}>
        <Provider value={context}>{render()}</Provider>
      </Content>
    </Container>
  );
}
