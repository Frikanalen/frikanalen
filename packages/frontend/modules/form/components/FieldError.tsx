import React from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import { useField } from "../hooks/useField";
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";

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
  color: ${(props) => props.theme.color.secondAccent};

  font-weight: 600;
  font-size: 0.8em;

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

export const FieldError = observer((props: FieldErrorProps) => {
  const field = useField(props.name);

  const meta = {
    error: field.error,
    touched: field.touched,
    dirty: field.dirty,
  };

  const hasError = !!(meta.error && meta.touched && meta.dirty);

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
});
