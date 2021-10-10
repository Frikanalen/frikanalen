import styled from "@emotion/styled";
import { ButtonList } from "modules/ui/components/ButtonList";
import { PropsWithChildren } from "react";

export const Container = styled(ButtonList)`
  justify-content: flex-end;
`;

export function Actions(props: PropsWithChildren<{}>) {
  return <Container horizontal>{props.children}</Container>;
}
