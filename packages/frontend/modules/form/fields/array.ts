import {
  ObservableFormField,
  ObservableFormFieldOptions,
} from "../classes/ObservableFormField"

export class ObservableArrayField<T> extends ObservableFormField<T[]> {
  public min(min: number, message = `Minimum ${min} items`) {
    this.validators.add(async (value) => {
      return value.length < min ? message : ""
    })

    return this
  }

  public max(max: number, message = `Maximum ${max} items`) {
    this.validators.add(async (value) => {
      return value.length > max ? message : ""
    })

    return this
  }
}

export const array = <T>(options: ObservableFormFieldOptions<T[]>) => {
  return new ObservableArrayField(options)
}
