import { ObservableFormField } from "./ObservableFormField";
import { computed } from "mobx";
import { ObservableFieldList } from "../fields/fieldList";
import { ObservableFieldObject } from "../fields/fieldObject";
import { checkIfFieldIsReady } from "../helpers/checkIfFieldIsReady";
import { checkFieldMeta } from "../helpers/checkFieldMeta";
import { Manager } from "modules/state/types";

export type Field = ObservableFormField<any> | ObservableFieldList<any> | ObservableFieldObject<any>;

export type FieldsType = {
  [field: string]: Field;
};

export class ObservableForm<F extends FieldsType> {
  public constructor(public fields: F, manager: Manager) {
    Object.values(fields).map((f) => f.setManager(manager));
  }

  @computed
  public get serialized() {
    const result: any = {};

    for (const [key, field] of Object.entries(this.fields)) {
      result[key] = field.serializedValue;
    }

    return result;
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

  @computed
  public get valid() {
    for (const field of Object.values(this.fields)) {
      const meta = checkFieldMeta(field);

      if (meta.error) {
        return false;
      }
    }

    return true;
  }

  public async validate() {
    for (const field of Object.values(this.fields)) {
      const meta = checkFieldMeta(field);
      await meta.validate();
    }
  }

  public touch() {
    for (const field of Object.values(this.fields)) {
      const meta = checkFieldMeta(field);
      meta.touch();
    }
  }

  public makeDirty() {
    for (const field of Object.values(this.fields)) {
      const meta = checkFieldMeta(field);
      meta.makeDirty();
    }
  }

  public async ensureValidity() {
    this.touch();
    this.makeDirty();

    await this.validate();
    return this.valid;
  }

  public destroy() {
    for (const field of Object.values(this.fields)) {
      field.destroy();
    }
  }
}
