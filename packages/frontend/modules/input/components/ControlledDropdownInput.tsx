import { useObserver } from "mobx-react-lite";
import { ObservableSelectField } from "modules/form/fields/select";
import { useField } from "modules/form/hooks/useField";
import { DropdownInput, DropdownInputProps } from "./DropdownInput";
import React from "react";

export type ControlledDropdownInputProps = Omit<DropdownInputProps, "value" | "options" | "multiple"> & {
  name: string;
};

export function ControlledDropdownInput(props: ControlledDropdownInputProps) {
  const { name, ...rest } = props;

  const field = useField<ObservableSelectField>(name);
  const value = useObserver(() => field.value);

  return (
    <DropdownInput
      multiple={field.multiple}
      options={field.options}
      onChange={(v) => field.setValue(v)}
      value={value}
      {...rest}
    />
  );
}
