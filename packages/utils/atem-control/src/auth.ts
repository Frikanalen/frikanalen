import { getLogger } from "./logger.js";
import { V1CheckStaff } from "./auth/sessionV1.js";
import { V2CheckStaff } from "./auth/sessionV2.js";
import { FetchError } from "node-fetch";

const logger = getLogger();

type authenticationCookies = {
  sessionid?: string; // API v1 session ID
  "fk-session"?: string; // API v2 session ID
};

export const checkIfStaff = async (requestCookies: authenticationCookies) => {
  const V1SessionId = requestCookies?.["sessionid"];
  const V2SessionId = requestCookies?.["fk-session"];
  try {
    if (V2SessionId) {
      return V2CheckStaff(V2SessionId);
    } else if (V1SessionId) {
      return V1CheckStaff(V1SessionId);
    }
  } catch (e: any) {
    if (e instanceof FetchError) {
      console.error(`HTTP ${e.code}, ${e.message}`);
    } else {
      console.error(`Error: ${e.toString()}`);
    }

    return false;
  }
  logger.warn("Rejecting request with neither v1 nor v2 API session cookie");
  return false;
};
