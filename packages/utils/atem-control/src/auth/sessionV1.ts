import { FK_API_URL } from "../server.js";
import { getLogger } from "../logger.js";
const logger = getLogger();
import { z } from "zod";
import fetch from "node-fetch";

const V1ProfileResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  isStaff: z.boolean(),
});

type V1ProfileResponse = z.infer<typeof V1ProfileResponseSchema>;

export const getV1Profile = async (
  sessionId: string
): Promise<V1ProfileResponse> => {
  const res = await fetch(`${FK_API_URL}/user`, {
    headers: {
      cookie: `sessionid=${sessionId}`,
    },
  });
  return V1ProfileResponseSchema.parse(await res.json());
};

export const V1CheckStaff = async (sessionId: string) => {
  const userProfile = await getV1Profile(sessionId);

  if (userProfile.isStaff) {
    logger.info(`Authenticated API V1 request for ${userProfile.email}`);
    return true;
  }

  logger.info(`User ${userProfile.email} is not staff, refusing`);
  return false;
};
