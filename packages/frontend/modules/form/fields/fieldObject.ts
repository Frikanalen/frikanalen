import { FieldsType } from "../classes/ObservableForm";
import { computed, observable } from "mobx";
import { checkIfFieldIsReady } from "../helpers/checkIfFieldIsReady";
import { ValidatorList } from "../classes/ValidatorList";
import { Manager } from "modules/state/types";

export class ObservableFieldObject<F extends FieldsType> {
  protected manager!: Manager;
  protected validators: ValidatorList<F>;

  @observable public touched = false;
  @observable public dirty = false;

  public constructor(public fields: F) {
    this.validators = new ValidatorList(this.fields);

    // Validate all fields within
    this.validators.add(async (value) => {
      let invalid = false;

      for (const field of Object.values(value)) {
        await field.validate();

        if (field.error) {
          invalid = true;
          break;
        }
      }

      return invalid ? "One or more fields are invalid" : "";
    });
  }

  /** Must be called first before doing anything else */
  public setManager(manager: Manager) {
    this.manager = manager;
    Object.values(this.fields).forEach((x) => x.setManager(manager));
  }

  @computed
  public get serializedValue(): any {
    return Object.fromEntries(Object.entries(this.fields).map(([k, f]) => [k, f.serializedValue]));
  }

  @computed
  public get ready() {
    for (const field of Object.values(this.fields)) {
      const ready = checkIfFieldIsReady(field);

      if (!ready) {
        return false;
      }
    }

    return true;
  }

  public touch = () => {
    this.touched = true;

    for (const field of Object.values(this.fields)) {
      field.touch();
    }

    this.validators.validate(this.fields);
  };

  public validate = async () => {
    await this.validators.validate(this.fields);
  };

  public destroy() {
    for (const field of Object.values(this.fields)) {
      field.destroy();
    }
  }

  @computed
  public get error() {
    return this.validators.error;
  }
}

export const fieldObject = <F extends FieldsType>(fields: F) => {
  return new ObservableFieldObject(fields);
};
