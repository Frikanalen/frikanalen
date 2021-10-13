import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const Root = styled.aside`
  width: 460px;
  max-width: 100%;
  max-height: 100vh;

  border-radius: 3px;

  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.color.card};

  display: flex;
  flex-direction: column;

  @media (max-width: 460px) {
    border-radius: 0px;
  }
`;

export function Container(props: PropsWithChildren<{ className?: string }>) {
  const { children, ...rest } = props;

  return <Root {...rest}>{children}</Root>;
}
