import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, ButtonProps, ButtonWithProps } from "./Button";

export type GenericButtonVariant = "primary" | "secondary";
export type GenericButtonColor = "accent" | "warning" | "success" | "danger";

const getColorFromTheme = (theme: Theme, name: GenericButtonColor) => {
  const { color, stateColor } = theme;

  if (name === "accent") return color.accent;
  return stateColor[name];
};

const Container = styled(Button as ButtonWithProps<{ variant: GenericButtonVariant; color: GenericButtonColor }>)`
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
          border: solid 2px ${getColorFromTheme(props.theme, props.color)};
          opacity: 0.6;
        `;
      }

      return css`
        background: ${getColorFromTheme(props.theme, props.color)};
        box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.1);
      `;
    }}
  }

  ${(props) => {
    if (props.variant === "secondary") {
      return css`
        color: ${getColorFromTheme(props.theme, props.color)};
      `;
    }

    return css`
      color: ${props.theme.fontColor.overlay};
    `;
  }}
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 0.9em;
`;

export type GenericButtonProps = ButtonProps & {
  label: string;
  variant: GenericButtonVariant;
  color?: GenericButtonColor;
};

export function GenericButton(props: GenericButtonProps) {
  const { label, color = "accent", ...rest } = props;

  return (
    <Container color={color} {...rest}>
      <Label>{label}</Label>
    </Container>
  );
}
