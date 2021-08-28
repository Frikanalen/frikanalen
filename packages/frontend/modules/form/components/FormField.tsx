import React, { PropsWithChildren } from "react";
import { FieldError } from "./FieldError";
import styled from "@emotion/styled";

export type FormFieldProps = PropsWithChildren<{
  className?: string;
  name: string;
  label: string;
}>;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9em;
  letter-spacing: 0.025em;

  margin-bottom: 12px;
  color: ${(props) => props.theme.color.accent};
`;

export function FormField(props: FormFieldProps) {
  const { children, name, label, className } = props;

  return (
    <Container className={className}>
      <Label htmlFor={name}>{label}</Label>
      {children}
      <FieldError name={name} />
    </Container>
  );
}

export type FormFieldWithProps<T extends object> = (props: FormFieldProps & T) => JSX.Element;
