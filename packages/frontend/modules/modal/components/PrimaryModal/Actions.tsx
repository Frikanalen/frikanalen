import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

export const Container = styled.div`
  justify-content: flex-end;
`;

export function Actions(props: PropsWithChildren<{}>) {
  return <Container>{props.children}</Container>;
}
