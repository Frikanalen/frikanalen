import fetch from "node-fetch";
import { FK_APIV2_URL } from "../server.js";
import { getLogger } from "../logger.js";
import { z } from "zod";

const logger = getLogger();

const V2AuthenticatedSession = z.object({
  authenticated: z.literal(true),
  user: z.object({
    id: z.number(),
    email: z.string(),
    permissions: z.array(z.string()),
  }),
});

const V2UnauthenticatedSession = z.object({ authenticated: z.literal(false) });

const V2ProfileResponseSchema = z.discriminatedUnion("authenticated", [
  V2AuthenticatedSession,
  V2UnauthenticatedSession,
]);

type V2ProfileResponse = z.infer<typeof V2ProfileResponseSchema>;

export const getV2Session = async (
  fkSession: string
): Promise<V2ProfileResponse> => {
  const res = await fetch(`${FK_APIV2_URL}/auth/user?withRoles=true`, {
    headers: {
      cookie: `fk-session=${fkSession}`,
    },
  });
  return V2ProfileResponseSchema.parse(await res.json());
};

export const V2CheckStaff = async (fkSession: string) => {
  const session = await getV2Session(fkSession);

  if (!session.authenticated) {
    logger.info(`Session ID not authenticated, refusing`);
    return false;
  }

  const { permissions, email } = session.user;

  if (permissions.indexOf("ATEM_CONTROL") < 0) {
    logger.info(`"${email}" does not have permission ATEM_CONTROL, refusing`);
    return false;
  }

  logger.info(`Authenticated API V2 request for "${email}"`);
  return true;
};
