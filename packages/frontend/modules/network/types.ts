// Represents the REST api collection format
export type ApiCollection<T> = {
  count: number;
  results: T[];
};
