import { randomBytes } from "crypto";

export const getHash = (bytes: number) => {
  return randomBytes(bytes).toString("hex");
};

export const toTitleCase = (str: string) => {
  const splitStr = str.toLowerCase().split(" ");

  const exceptions = ["i", "og", "for", "mot", "ved", "av"];

  for (let i = 0; i < splitStr.length; i += 1) {
    if (exceptions.indexOf(splitStr[i]) === -1) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1);
    }
  }

  return splitStr.join(" ");
};

export const truncate = (str: string, length: number) => {
  if (str.length > length) return str.slice(0, length).trim() + "...";
  return str;
};

export const toSafeAsciiString = (string: string) => string.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, " ");
