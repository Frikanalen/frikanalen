import { observable, computed } from "mobx";
import { Manager } from "modules/state/types";
import { ValidatorList } from "./ValidatorList";

export type ObservableFormFieldLike<V, SV = V> = {
  setManager: (m: Manager) => void;

  value: V;
  setValue: (v: V) => void;
  serializedValue: SV;

  touched: boolean;
  touch: () => void;

  dirty: boolean;
  reset: () => void;

  destroy: () => void;
  error?: string;
};

export type ObservableFormFieldOptions<V> = {
  value: V;
};

export class ObservableFormField<V, SV = V> implements ObservableFormFieldLike<V, SV> {
  protected manager!: Manager;
  protected validators: ValidatorList<V>;

  @observable public touched = false;
  @observable public dirty = false;
  @observable public value: V;

  private defaultValue: V;

  public constructor(options: ObservableFormFieldOptions<V>) {
    this.value = options.value;
    this.defaultValue = options.value;
    this.validators = new ValidatorList(this.value);
  }

  @computed
  public get serializedValue(): SV {
    return this.value as any;
  }

  /** Must be called first before doing anything else */
  public setManager(manager: Manager) {
    this.manager = manager;
  }

  public setValue(v: V) {
    this.value = v;
    this.dirty = true;
    this.validators.validate(v);
  }

  public touch = () => {
    this.touched = true;
    this.validators.validate(this.value);
  };

  public makeDirty = () => {
    this.dirty = true;
  };

  public reset = () => {
    this.value = this.defaultValue;
    this.touched = false;
    this.dirty = false;
    this.validators.validate(this.value);
  };

  public validate = async () => {
    await this.validators.validate(this.value);
  };

  public destroy() {}

  @computed
  public get error() {
    return this.validators.error;
  }
}
