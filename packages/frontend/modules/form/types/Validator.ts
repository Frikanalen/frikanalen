export type Validator<T> = (value: T) => Promise<string | null>
