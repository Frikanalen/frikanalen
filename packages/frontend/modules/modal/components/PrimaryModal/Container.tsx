import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const Root = styled.aside`
  min-width: 460px;
  border-radius: 3px;

  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.color.card};

  @media (max-width: 458px) {
    min-width: 0px;
    border-radius: 0px;
  }
`;

export function Container(props: PropsWithChildren<{ className?: string }>) {
  const { children, ...rest } = props;

  return <Root {...rest}>{children}</Root>;
}
