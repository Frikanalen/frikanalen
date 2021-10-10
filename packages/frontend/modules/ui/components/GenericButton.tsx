import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, ButtonProps, ButtonWithProps } from "./Button";

export type GenericButtonVariant = "primary" | "secondary";

const Container = styled(Button as ButtonWithProps<{ variant: GenericButtonVariant }>)`
  align-items: center;
  padding: 0px 16px;

  height: 38px;
  border-radius: 4px;

  position: relative;
  z-index: 1;

  &:hover:before {
    opacity: 1;
  }

  &:before {
    content: "";
    display: block;

    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: -1;

    border-radius: 4px;
    opacity: 0.8;

    transition: 200ms ease opacity;

    ${(props) => {
      if (props.variant === "secondary") {
        return css`
          border: solid 2px ${props.theme.color.accent};
          opacity: 0.6;
        `;
      }

      return css`
        background: ${props.theme.color.accent};
        box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.1);
      `;
    }}
  }

  ${(props) => {
    if (props.variant === "secondary") {
      return css`
        color: ${props.theme.color.accent};
      `;
    }

    return css`
      color: ${props.theme.fontColor.overlay};
    `;
  }}
`;

const Label = styled.span`
  font-weight: 500;
`;

export type GenericButtonProps = ButtonProps & {
  label: string;
  variant: GenericButtonVariant;
};

export function GenericButton(props: GenericButtonProps) {
  const { label, ...rest } = props;

  return (
    <Container {...rest}>
      <Label>{label}</Label>
    </Container>
  );
}
