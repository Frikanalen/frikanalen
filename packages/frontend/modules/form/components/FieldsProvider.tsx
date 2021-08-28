import { createContext, PropsWithChildren } from "react"
import { FieldsType } from "../classes/ObservableForm"
import React from "react"

export const fieldsContext = createContext<FieldsType | undefined>(undefined)
const { Provider } = fieldsContext

export type FieldsProviderProps = PropsWithChildren<{
  fields: FieldsType
}>

export function FieldsProvider(props: FieldsProviderProps) {
  const { fields, children } = props

  return <Provider value={fields}>{children}</Provider>
}
