import { AxiosError } from "axios";

export type ErrorType = "unknown" | "not-found" | "unauthorized";

export const interpretError = (error: any): ErrorType => {
  const { response } = error as AxiosError;

  if (response) {
    const { status } = response;

    if (status === 404) return "not-found";
    if (status === 401) return "unauthorized";
    if (status === 500) return "unknown";
  }

  return "unknown";
};

export const errorToStatusMap: Record<ErrorType, number> = {
  "not-found": 404,
  unauthorized: 401,
  unknown: 500,
};
