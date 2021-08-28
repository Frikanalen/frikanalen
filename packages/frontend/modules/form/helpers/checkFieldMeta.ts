import { Field } from "../classes/ObservableForm"

export type Validatable = Field & {
  validate: () => Promise<void>
  touch: () => void
  error?: string
  touched: boolean
  dirty: boolean
}

const isValidatable = (field: Field): field is Validatable => {
  return "validate" in field && "touch" in field && "error" in field
}

export const checkFieldMeta = (field: Field) => {
  if (isValidatable(field)) {
    const { error, touched, dirty, touch, validate } = field
    return { error, touched, dirty, touch, validate }
  }

  return {
    error: "",
    touched: false,
    dirty: false,
    touch: () => {},
    validate: async () => {},
  }
}
