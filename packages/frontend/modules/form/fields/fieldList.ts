import { computed, observable } from "mobx";
import { Field } from "../classes/ObservableForm";
import { checkIfFieldIsReady } from "../helpers/checkIfFieldIsReady";
import { ValidatorList } from "../classes/ValidatorList";
import { Manager } from "modules/state/types";

export type ObservableFieldListOptions<F extends Field> = {
  fields?: F[];
  create: () => F;
  min?: number;
  max: number;
  minWarning?: string;
  maxWarning?: string;
  fieldInvalidWarning?: string;
};

/** Represents a list of fields */
export class ObservableFieldList<F extends Field> {
  protected manager!: Manager;
  protected validators: ValidatorList<F[]>;

  @observable public fields: F[];
  @observable public touched = false;
  @observable public dirty = false;

  private create: () => F;

  public min: number;
  public max: number;

  public constructor(options: ObservableFieldListOptions<F>) {
    this.fields = options.fields ?? [];
    this.create = () => options.create();

    this.min = options.min ?? 0;
    this.max = options.max;

    this.validators = new ValidatorList(this.fields);

    // Validate min and max
    this.validators.add(async (value) => {
      if (value.length < this.min) return options.minWarning ?? `Minimum ${this.min}`;
      if (value.length > this.max) return options.maxWarning ?? `Maximum ${this.max}`;

      return "";
    });

    // Validate all fields within
    this.validators.add(async (value) => {
      let invalid = false;

      for (const field of value) {
        await field.validate();

        if (field.error) {
          invalid = true;
          break;
        }
      }

      return invalid ? options.fieldInvalidWarning ?? "One or more fields are invalid" : "";
    });
  }

  /** Must be called first before doing anything else */
  public setManager(manager: Manager) {
    this.manager = manager;
    this.fields.forEach((x) => x.setManager(manager));
  }

  public add() {
    const field = this.create();
    field.setManager(this.manager);

    this.fields.push(field);
    this.validators.validate(this.fields);

    return field;
  }

  public remove(index: number) {
    this.fields = this.fields.filter((_, i) => i !== index);
    this.validators.validate(this.fields);
  }

  public move(index: number, newIndex: number) {
    const field = this.fields[index];

    this.fields.splice(index, 1);
    this.fields.splice(newIndex, 0, field);
  }

  public validate = async () => {
    await this.validators.validate(this.fields);
  };

  public touch = () => {
    this.touched = true;

    for (const field of this.fields) {
      field.touch();
    }

    this.validators.validate(this.fields);
  };

  public reset = () => {
    this.touched = false;
    this.validators.validate(this.fields);
  };

  public destroy() {
    for (const field of this.fields) {
      field.destroy();
    }
  }

  @computed
  public get error() {
    return this.validators.error;
  }

  @computed
  public get serializedValue(): any[] {
    return this.fields.map((x) => x.serializedValue);
  }

  @computed
  public get ready() {
    for (const field of this.fields) {
      const ready = checkIfFieldIsReady(field);

      if (!ready) {
        return false;
      }
    }

    return true;
  }
}

export type FieldListFactoryOptions<F extends Field> = {
  fields: F[];
  create: () => F;
  min?: number;
  max: number;
  minWarning?: string;
  maxWarning?: string;
  fieldInvalidWarning?: string;
};

export const fieldList = <F extends Field>(options: FieldListFactoryOptions<F>) => {
  return new ObservableFieldList(options);
};
