import React, { useState } from "react";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { FIELDSET_HEIGHT } from "../constants";

export type TextInputProps = {
  name?: string;
  value?: string;
  placeholder?: string;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent<any>) => void;
  invalid?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  className?: string;
};

const baseStyle = (props: { theme: Theme }) => css`
  flex: 1;

  font-size: 0.9em;
  font-family: "Roboto", sans-serif;

  color: ${props.theme.fontColor.normal};
  padding: 11px 12px;

  outline: none;

  ::placeholder {
    font-family: "Roboto", sans-serif;
    font-weight: 400;

    color: ${props.theme.fontColor.muted};
    opacity: 1;
  }
`;

export type StateProps = { invalid?: boolean; focused?: boolean };

const stateStyle = (props: StateProps) => {
  if (props.invalid)
    return css`
      & {
        border-color: ${(props as any).theme.color.secondAccent};
      }
    `;

  if (props.focused) {
    return css`
      border-color: ${(props as any).theme.color.accent};
    `;
  }
};

const Container = styled.div`
  display: flex;
  align-items: center;

  border-radius: 4px;
  border: solid 1px ${(props) => props.theme.color.divider};

  transition: 200ms ease border-color;

  ${stateStyle}
`;

const Input = styled.input`
  height: ${FIELDSET_HEIGHT};
  ${baseStyle}
`;

const MultilineInput = styled.textarea`
  min-height: calc(${FIELDSET_HEIGHT} * 2);
  white-space: pre-line;
  resize: vertical;
  ${baseStyle}
`;

export function TextInput(props: TextInputProps) {
  const { multiline, className, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const focusProps = {
    onFocus: (e: React.FocusEvent) => {
      setFocused(true);
      rest.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      setFocused(false);
      rest.onBlur?.(e);
    },
  };

  if (multiline) {
    return (
      <Container className={className} focused={focused}>
        <MultilineInput {...rest} {...focusProps} />
      </Container>
    );
  }

  return (
    <Container className={className} focused={focused}>
      <Input {...rest} {...focusProps} />
    </Container>
  );
}
