import { ObservableSelectField } from "modules/form/fields/select";
import { useField } from "modules/form/hooks/useField";
import { DropdownInput, DropdownInputProps } from "./DropdownInput";
import React from "react";
import { observer } from "mobx-react-lite";

export type ControlledDropdownInputProps = Omit<DropdownInputProps, "value" | "options" | "multiple"> & {
  name: string;
};

export const ControlledDropdownInput = observer((props: ControlledDropdownInputProps) => {
  const { name, ...rest } = props;
  const field = useField<ObservableSelectField>(name);

  return (
    <DropdownInput
      multiple={field.multiple}
      options={field.options}
      onChange={(v) => field.setValue(v)}
      value={field.value}
      {...rest}
    />
  );
});
