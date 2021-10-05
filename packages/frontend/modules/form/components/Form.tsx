import { createContext, PropsWithChildren } from "react";
import { ObservableForm } from "../classes/ObservableForm";
import React from "react";
import { FieldsProvider } from "./FieldsProvider";

export const formContext = createContext<ObservableForm<any> | undefined>(undefined);
const { Provider } = formContext;

export type FormProps = PropsWithChildren<{
  className?: string;
  form: ObservableForm<any>;
  onSubmit?: () => void;
}>;

export function Form(props: FormProps) {
  const { className, form, onSubmit, children } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) onSubmit();
  };

  return (
    <form className={className} style={{ width: className ? undefined : "100%" }} onSubmit={handleSubmit}>
      <Provider value={form}>
        <FieldsProvider fields={form.fields}>{children}</FieldsProvider>
      </Provider>
      <input
        type="submit"
        style={{
          position: "absolute",
          left: "-999999px",
        }}
      />
    </form>
  );
}
