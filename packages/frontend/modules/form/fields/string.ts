import {
  ObservableFormField,
  ObservableFormFieldOptions,
} from "../classes/ObservableFormField"

const defaultOptions: ObservableFormFieldOptions<string> = {
  value: "",
}

export class ObservableStringField extends ObservableFormField<string> {
  public required(message = "This field is required") {
    this.validators.add(async (value) => {
      if (!value) return message
      return ""
    })

    return this
  }

  public regex(regex: RegExp, message = "The regex does not match") {
    this.validators.add(async (value) => {
      if (!value) return ""

      const match = value.match(regex)

      if (match === null) {
        return message
      }

      return ""
    })

    return this
  }

  public max(max: number, message = `Field cannot exceed ${max} characters`) {
    this.validators.add(async (value) => {
      if (!value) return ""
      return value.length > max ? message : ""
    })

    return this
  }

  public min(min: number, message = `Field must be at least ${min} characters`) {
    this.validators.add(async (value) => {
      if (!value) return ""
      return value.length < min ? message : ""
    })

    return this
  }
}

export const string = (options = defaultOptions) => {
  return new ObservableStringField(options)
}
