import { createContext, PropsWithChildren } from "react"
import { ObservableForm } from "../classes/ObservableForm"
import React from "react"
import { FieldsProvider } from "./FieldsProvider"

export const formContext = createContext<ObservableForm<any> | undefined>(undefined)
const { Provider } = formContext

export type FormProps = PropsWithChildren<{
  form: ObservableForm<any>
}>

export function Form(props: FormProps) {
  const { form, children } = props

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={onSubmit}>
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
  )
}
