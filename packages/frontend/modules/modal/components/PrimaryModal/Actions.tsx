import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

export const Container = styled.div`
  display: flex;
  justify-content: flex-end;

  flex: 1;

  > * {
    margin-left: 16px;
  }
`;

export function Actions(props: PropsWithChildren<{}>) {
  return <Container>{props.children}</Container>;
}
