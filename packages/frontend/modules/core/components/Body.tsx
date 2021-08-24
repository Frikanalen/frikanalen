import styled from "@emotion/styled";
import React from "react";
import { CONTENT_WIDTH } from "../constants";

export const Container = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 32px;
  width: 100%;
`;

const Content = styled.main`
  max-width: ${CONTENT_WIDTH}px;
  width: 100%;
`;

export function Body(props: React.PropsWithChildren<{}>) {
  const { children } = props;

  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
}
