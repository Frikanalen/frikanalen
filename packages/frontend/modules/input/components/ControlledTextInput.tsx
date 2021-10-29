import React from "react";
import { TextInput, TextInputProps } from "./TextInput";
import { useField } from "../../form/hooks/useField";
import { ObservableStringField } from "../../form/fields/string";
import { observer } from "mobx-react-lite";

export type ControlledTextInputProps = Omit<TextInputProps, "value"> & {
  type?: "text" | "password" | "number";
  name: string;
};

export const ControlledTextInput = observer((props: ControlledTextInputProps) => {
  const { name, ...rest } = props;

  const field = useField<ObservableStringField>(name);

  const inputProps = {
    value: field.value,
    invalid: !!(field.error && field.touched),
  };

  return (
    <TextInput
      onChange={(e) => field.setValue(e.target.value)}
      onBlur={() => field.touch()}
      {...inputProps}
      {...rest}
    />
  );
});
