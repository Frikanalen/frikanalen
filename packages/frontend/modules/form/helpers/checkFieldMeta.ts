import { Field } from "../classes/ObservableForm";

export type Validatable = Field & {
  validate: () => Promise<void>;
  makeDirty: () => void;
  touch: () => void;
  error?: string;
  touched: boolean;
  dirty: boolean;
};

const isValidatable = (field: Field): field is Validatable => {
  return "validate" in field && "touch" in field && "error" && "dirty" in field;
};

export const checkFieldMeta = (field: Field) => {
  if (isValidatable(field)) {
    const { error, touched, dirty, touch, makeDirty, validate } = field;
    return { error, touched, dirty, touch, makeDirty, validate };
  }

  return {
    error: "",
    touched: false,
    dirty: false,
    touch: () => {},
    makeDirty: () => {},
    validate: async () => {},
  };
};
