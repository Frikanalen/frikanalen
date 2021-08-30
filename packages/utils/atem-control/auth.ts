import fetch from "node-fetch";
import { FK_API_URL } from "./server";
import { getLogger } from "./logger";

const logger = getLogger();

interface authenticationCookies {
  csrftoken?: string;
  sessionid?: string;
}

export const getProfile = async ({
  csrftoken,
  sessionid,
}: authenticationCookies) => {
  const res = await fetch(`${FK_API_URL}/user`, {
    headers: {
      cookie: `csrftoken=${csrftoken}; sessionid=${sessionid}`,
    },
  });
  return await res.json();
};

export const checkIfStaff = async (requestCookies: authenticationCookies) => {
  if (!("csrftoken" in requestCookies && "sessionid" in requestCookies)) {
    logger.warn("Refusing to authenticate without authorization header");
    return false;
  }

  const userProfile = await getProfile(requestCookies);
  if (userProfile.isStaff) {
    logger.info(`Authenticated request for ${userProfile.email}`);
    return true;
  } else {
    logger.info(`User %{userProfile.email} is not staff, refusing`);
    return false;
  }
};
