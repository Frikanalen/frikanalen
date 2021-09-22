import { ObservableFormField, ObservableFormFieldOptions } from "../classes/ObservableFormField";

const defaultOptions: ObservableFormFieldOptions<string> = {
  value: "",
};

export class ObservableStringField extends ObservableFormField<string> {
  public required(message = "Dette feltet er påkrevd") {
    this.validators.add(async (value) => {
      if (!value) return message;
      return "";
    });

    return this;
  }

  public regex(regex: RegExp, message = "Samsvarer ikke med regex") {
    this.validators.add(async (value) => {
      if (!value) return "";

      const match = value.match(regex);

      if (match === null) {
        return message;
      }

      return "";
    });

    return this;
  }

  public max(max: number, message = `Maks ${max} tegn kreves`) {
    this.validators.add(async (value) => {
      if (!value) return "";
      return value.length > max ? message : "";
    });

    return this;
  }

  public min(min: number, message = `Minimum ${min} tegn kreves`) {
    this.validators.add(async (value) => {
      if (!value) return "";
      return value.length < min ? message : "";
    });

    return this;
  }
}

export const string = (options = defaultOptions) => {
  return new ObservableStringField(options);
};
