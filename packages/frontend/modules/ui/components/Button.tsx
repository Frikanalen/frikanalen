import styled from "@emotion/styled";
import React from "react";
import { ComponentPropsWithoutRef } from "react";

const Container = styled.button<{ stretch?: boolean }>`
  display: inline-block;
  pointer-events: none;

  ${(props) =>
    props.stretch &&
    `
    width: 100%;
  `}
`;

const Inner = styled.span`
  display: flex;
  width: 100%;

  pointer-events: all;
  user-select: none;
`;

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  stretch?: boolean;
};

function _Button(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const { stretch, className, children, ...rest } = props;

  return (
    <Container ref={ref} stretch={stretch} {...rest}>
      <Inner className={className}>{children}</Inner>
    </Container>
  );
}

export const Button = React.forwardRef(_Button);
