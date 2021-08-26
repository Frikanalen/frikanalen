import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, ButtonProps } from "./Button";

const Container = styled(Button)`
  align-items: center;
  padding: 0px 16px;

  height: 38px;
  border-radius: 4px;

  opacity: 0.8;
  transition: 200ms ease opacity;

  &:hover {
    opacity: 1;
  }

  ${(props) => css`
    border: solid 2px ${props.theme.color.accent};
    color: ${props.theme.color.accent};
  `};
`;

const Label = styled.span`
  font-weight: 600;
`;

export type GenericButtonProps = ButtonProps & {
  label: string;
};

export function GenericButton(props: GenericButtonProps) {
  const { label, ...rest } = props;

  return (
    <Container {...rest}>
      <Label>{label}</Label>
    </Container>
  );
}
