import { observable, computed } from "mobx"
import { Validator } from "../types/Validator"

export class ValidatorList<T> {
  @observable private currentValue: T

  @observable private validatedValue?: T
  @observable private validatingPromise?: Promise<void>
  @observable private validationError?: string

  private validators: Validator<T>[] = []

  public constructor(value: T) {
    this.currentValue = value
  }

  public add(validator: Validator<T>) {
    this.validators = [...this.validators, validator]
  }

  public async validate(value: T): Promise<void> {
    this.currentValue = value

    if (this.isValidating) {
      await this.validatingPromise

      if (!this.isFresh) {
        return this.validate(this.currentValue)
      }
    }

    await (this.validatingPromise = this.runValidators(value))
    this.validatingPromise = undefined
  }

  private async runValidators(value: T) {
    const results = await Promise.all(this.validators.map((v) => v(value)))
    const invalidResult = results.find((r) => r)

    this.validatedValue = value

    if (invalidResult) {
      this.validationError = invalidResult
      return
    }

    this.validationError = undefined
  }

  @computed
  public get isFresh() {
    return this.currentValue === this.validatedValue
  }

  @computed
  public get isValidating() {
    return this.validatingPromise !== undefined
  }

  @computed
  public get isValid() {
    return this.validationError === undefined && this.isFresh
  }

  @computed
  public get error() {
    return this.validationError
  }
}
