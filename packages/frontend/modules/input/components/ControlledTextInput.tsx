import React from "react";
import { TextInput, TextInputProps } from "./TextInput";
import { useField } from "../../form/hooks/useField";
import { ObservableStringField } from "../../form/fields/string";
import { useObserver } from "mobx-react-lite";

export type ControlledTextInputProps = Omit<TextInputProps, "value"> & {
  type?: "text" | "password" | "number";
  name: string;
};

export function ControlledTextInput(props: ControlledTextInputProps) {
  const { name, ...rest } = props;

  const field = useField<ObservableStringField>(name);

  const inputProps = useObserver(() => ({
    value: field.value,
    invalid: !!(field.error && field.touched),
  }));

  return (
    <TextInput
      onChange={(e) => field.setValue(e.target.value)}
      onBlur={() => field.touch()}
      {...inputProps}
      {...rest}
    />
  );
}
