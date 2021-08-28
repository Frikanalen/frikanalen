import { useContext } from "react"
import { ObservableForm } from "../classes/ObservableForm"
import { formContext } from "../components/Form"

export const useForm = <F extends ObservableForm<any>>() => {
  const form = useContext(formContext)

  if (!form) {
    throw new Error("Form not found in context")
  }

  return form as F
}
