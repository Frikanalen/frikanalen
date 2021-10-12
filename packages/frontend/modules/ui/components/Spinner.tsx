import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
  to {
    transform: rotate(350deg);
  }
`;

const Container = styled.div<{ size: Size }>`
  ${(props) => {
    const size = props.size === "small" ? 24 : 48;

    return css`
      width: ${size}px;
      height: ${size}px;
    `;
  }}

  border: solid ${(props) => props.theme.color.divider};
  border-width: ${(props) => (props.size === "small" ? 3 : 4)}px;
  border-top-color: ${(props) => props.theme.color.accent};

  border-radius: 100%;
  animation: ${spin} infinite 800ms linear;
`;

type Size = "small" | "normal";

export type SpinnerProps = {
  className?: string;
  size: Size;
};

export function Spinner(props: SpinnerProps) {
  const { className, size } = props;

  return <Container className={className} size={size} />;
}
