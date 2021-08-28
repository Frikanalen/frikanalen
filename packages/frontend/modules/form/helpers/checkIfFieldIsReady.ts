import { Field } from "../classes/ObservableForm"

export type Readyable = Field & {
  ready: boolean
}

const isReadyable = (field: Field): field is Readyable => {
  return "ready" in field
}

export const checkIfFieldIsReady = (field: Field) => {
  if (isReadyable(field)) {
    return field.ready
  }

  return true
}
