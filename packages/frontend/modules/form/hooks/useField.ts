import { useContext } from "react"
import { fieldsContext } from "../components/FieldsProvider"
import { Field } from "../classes/ObservableForm"

export const useField = <F extends Field = Field>(name: string) => {
  const fields = useContext(fieldsContext)

  if (!fields) {
    throw new Error("Fields not found in context")
  }

  const field = fields[name] as F
  return field
}
