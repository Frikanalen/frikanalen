export const toggleArrayItem = <T>(arr: T[], item: T) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
