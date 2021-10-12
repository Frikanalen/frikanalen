import styled from "@emotion/styled";
import React from "react";
import { mainContentStyle } from "../styles/mainContentStyle";

export const Container = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 32px;
  width: 100%;
`;

const Content = styled.main`
  ${mainContentStyle}
`;

export function Body(props: React.PropsWithChildren<{}>) {
  const { children } = props;

  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
}
