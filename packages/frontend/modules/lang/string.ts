import { randomBytes } from "crypto";

export const getHash = (bytes: number) => {
  return randomBytes(bytes).toString("hex");
};
