import { observable, computed, makeObservable, action } from "mobx";
import { Validator } from "../types/Validator";

export class ValidatorList<T> {
  private currentValue: T;
  private validatedValue?: T;
  private validatingPromise?: Promise<void>;
  private validationError?: string;

  private validators: Validator<T>[] = [];

  public constructor(value: T) {
    this.currentValue = value;

    makeObservable<ValidatorList<T>, "currentValue" | "validatedValue" | "validatingPromise" | "validationError">(
      this,
      {
        currentValue: observable,
        validatedValue: observable,
        validatingPromise: observable,
        validationError: observable,
        isFresh: computed,
        isValid: computed,
        isValidating: computed,
        error: computed,
        add: action,
        validate: action,
      }
    );
  }

  public add(validator: Validator<T>) {
    this.validators = [...this.validators, validator];
  }

  public async validate(value: T): Promise<void> {
    this.currentValue = value;

    if (this.isValidating) {
      await this.validatingPromise;

      if (!this.isFresh) {
        return this.validate(this.currentValue);
      }
    }

    await (this.validatingPromise = this.runValidators(value));
    this.validatingPromise = undefined;
  }

  private async runValidators(value: T) {
    const results = await Promise.all(this.validators.map((v) => v(value)));
    const invalidResult = results.find((r) => r);

    this.validatedValue = value;

    if (invalidResult) {
      this.validationError = invalidResult;
      return;
    }

    this.validationError = undefined;
  }

  public get isFresh() {
    return this.currentValue === this.validatedValue;
  }

  public get isValidating() {
    return this.validatingPromise !== undefined;
  }

  public get isValid() {
    return this.validationError === undefined && this.isFresh;
  }

  public get error() {
    return this.validationError;
  }
}
