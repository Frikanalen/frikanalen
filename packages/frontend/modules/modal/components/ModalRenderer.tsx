import React from "react";

import { ModalItem } from "../stores/modalStore";
import styled from "@emotion/styled";
import { useStores } from "modules/state/manager";
import { modalContext } from "../contexts";

const { Provider } = modalContext;

export type ModalRendererProps = {
  item: ModalItem;
};

const Container = styled.div`
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
`;

const Content = styled.div``;

export function ModalRenderer(props: ModalRendererProps) {
  const { render, closeOnClickout, key } = props.item;
  const { modalStore } = useStores();

  const context = {
    dismiss: () => modalStore.dismiss(key, true),
    close: () => modalStore.dismiss(key),
  };

  const onClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      if (closeOnClickout) {
        context.close();
      }
    }
  };

  return (
    <Container onClick={onClick}>
      <Content>
        <Provider value={context}>{render()}</Provider>
      </Content>
    </Container>
  );
}
