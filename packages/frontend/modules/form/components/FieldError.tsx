import React from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import { useField } from "../hooks/useField";
import { useObserver } from "mobx-react-lite";
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export type FieldErrorProps = {
  name: string;
};

const Animation = keyframes`
  0% {
    opacity: 0%;
  }

  100% {
    opacity: 100%;
  }
`;

const Container = styled.div<{ visible: boolean }>`
  margin-top: 8px;
  max-height: 0px;

  ${(props) => {
    if (props.visible)
      return css`
        max-height: 64px;
        opacity: 1;
      `;

    return css`
      max-height: 0px;
      opacity: 0;
    `;
  }}

  transition: 200ms ease all;
`;

const Error = styled.span<{ status: TransitionStatus }>`
  display: block;
  color: ${(props) => props.theme.color.thirdAccent};

  font-weight: 600;
  font-size: 12px;

  ${(props) => {
    if (props.status === "entering")
      return css`
        animation: ${Animation} 200ms ease forwards;
      `;

    if (props.status === "exiting") {
      return css`
        animation: ${Animation} 200ms ease forwards reverse;
      `;
    }
  }}
`;

export function FieldError(props: FieldErrorProps) {
  const field = useField(props.name);

  const meta = useObserver(() => ({
    error: field.error,
    touched: field.touched,
  }));

  const hasError = useObserver(() => !!(meta.error && meta.touched));

  const renderError = () => {
    if (hasError) {
      return (
        <Transition key={meta.error} timeout={200}>
          {(status) => <Error status={status}>{meta.error}</Error>}
        </Transition>
      );
    }

    return (
      <Transition key="none" timeout={200}>
        <></>
      </Transition>
    );
  };

  return (
    <Container visible={hasError}>
      <SwitchTransition>{renderError()}</SwitchTransition>
    </Container>
  );
}
