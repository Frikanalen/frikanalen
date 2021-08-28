import {
  ObservableFormField,
  ObservableFormFieldOptions,
} from "../classes/ObservableFormField"
import { computed } from "mobx"

export type Option = {
  label: string
  value: any
}

export type ObservableSelectFieldOptions<T> = ObservableFormFieldOptions<T[]> & {
  options: Option[]
  multiple?: boolean
}

export class ObservableSelectField<T = any> extends ObservableFormField<T[], T[] | T> {
  public options: Option[]
  public multiple: boolean

  public constructor(options: ObservableSelectFieldOptions<T>) {
    super(options)

    this.options = options.options
    this.multiple = options.multiple ?? false
  }

  @computed
  public get serializedValue() {
    if (this.multiple) return this.value
    return this.value[0]
  }

  public requireOneOf(values: any[], message = "Required values are missing") {
    this.validators.add(async (value) => {
      const hasEither = values.find((v) => value.includes(v))
      if (!hasEither) return message

      return ""
    })

    return this
  }
}

export const select = <T>(options: ObservableSelectFieldOptions<T>) => {
  return new ObservableSelectField(options)
}
