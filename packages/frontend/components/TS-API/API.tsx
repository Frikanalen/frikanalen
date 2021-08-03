import * as z from "zod";
import base64 from "base-64";
import configs from "../configs";

export interface fkBulletin {
  id: number;
  heading: string;
  text: string;
}

export const fkCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string(),
  videocount: z.number(),
});

export type fkCategory = z.infer<typeof fkCategorySchema>;

export const fkCategoryQuerySchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: fkCategorySchema.array(),
});

export type fkCategoryQuery = z.infer<typeof fkCategoryQuerySchema>;

export const fkOrgSchema = z.object({
  id: z.number(),
  name: z.string(),
  postalAddress: z.string().nullable(),
  streetAddress: z.string().nullable(),
  editorId: z.number(),
  editorName: z.string(),
  editorEmail: z.string(),
  editorMsisdn: z.string(),
  homepage: z.string().nullable(),
  fkmember: z.boolean(),
  description: z.string(),
});

export type fkOrg = z.infer<typeof fkOrgSchema>;

export const fkVideoFilesSchema = z.object({
  smallThumb: z.string().optional(),
  medThumb: z.string().optional(),
  largeThumb: z.string().optional(),
  cloudflareId: z.string().optional(),
  broadcast: z.string().optional(),
  original: z.string().optional(),
  theora: z.string().optional(),
  vc1: z.string().optional(),
  srt: z.string().optional(),
});

export type fkVideo = z.infer<typeof fkVideoSchema>;

export const fkVideoSchema = z
  .object({
    name: z.string(),
    id: z.number(),
    organization: z.union([z.number(), fkOrgSchema]),
    files: fkVideoFilesSchema,
    description: z.string().nullable(),
    header: z.string().nullable(),
    creator: z.string(),
    duration: z.string(),
    categories: z.array(z.string()),
    framerate: z.number(),
    properImport: z.boolean(),
    hasTonoRecords: z.boolean(),
    publishOnWeb: z.boolean(),
    isFiller: z.boolean(),
    refUrl: z.string(),
    createdTime: z.string().nullable(),
    updatedTime: z.string(),
    uploadedTime: z.string().nullable(),
  })
  .nonstrict();

export const fkVideoPartialSchema = fkVideoSchema.partial();
export type fkVideoPartial = z.infer<typeof fkVideoPartialSchema>;

export const fkVideoQuerySchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: fkVideoSchema.array(),
});

export type fkVideoQuery = z.infer<typeof fkVideoQuerySchema>;

export const fkScheduleVideoSchema = z
  .object({
    name: z.string(),
    id: z.number(),
    organization: fkOrgSchema,
    description: z.string().nullable(),
    header: z.string().nullable(),
    creator: z.string(),
    duration: z.string(),
    categories: z.array(z.string()),
  })
  .nonstrict();

export const fkScheduleItemSchema = z.object({
  id: z.number(),
  schedulereason: z.number(),
  duration: z.string(), // FIXME: Backend bug
  video: fkScheduleVideoSchema.nullable(),
  starttime: z.string(),
  endtime: z.string(),
});

export type fkScheduleItem = z.infer<typeof fkScheduleItemSchema>;

export const fkScheduleSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(fkScheduleItemSchema),
});

export type fkSchedule = z.infer<typeof fkScheduleSchema>;

export interface APIGETOptions<T> {
  endpoint: string;
  validator?: (data: T) => T;
  token?: string;
  reloadCache?: boolean;
}

export async function APIGET<T>(opts: APIGETOptions<T>): Promise<T> {
  let authHeaders = {};
  let cacheOptions: RequestCache = "default";
  if (opts.token !== undefined) authHeaders = { Authorization: `Token ${opts.token}` };
  if (opts.reloadCache !== undefined) cacheOptions = "reload";
  const response = await fetch(`${configs.api}${opts.endpoint}`, { cache: cacheOptions, headers: authHeaders });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseJSON = (await response.json()) as T;

  if (opts.validator !== undefined) return opts.validator(responseJSON);

  console.log(`Warning: Used APIGET without validator to fetch ${opts.endpoint}`);
  return responseJSON;
}

export interface APIPOSTOptions<T> {
  endpoint: string;
  payload: T;
  token?: string;
  reloadCache?: boolean;
}

export async function APIPOST<T>(opts: APIPOSTOptions<T>): Promise<T> {
  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (opts.token !== undefined) headers.append("Authorization", `Token ${opts.token}`);

  const response = await fetch(`${configs.api}${opts.endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(opts.payload),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json() as Promise<T>;
}

export const fkOrgRoleSchema = z.object({
  role: z.string(),
  organizationId: z.number(),
  organizationName: z.string(),
});

export type fkOrgRole = z.infer<typeof fkOrgRoleSchema>;

export const fkUserSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  isStaff: z.boolean(),
  dateJoined: z.string(),
  id: z.number(),
  dateOfBirth: z.string(),
  organizationRoles: z.array(fkOrgRoleSchema),
});

export type fkUser = z.infer<typeof fkUserSchema>;

export const fkUploadTokenSchema = z.object({
  uploadToken: z.string(),
  uploadUrl: z.string(),
});

export type fkUploadToken = z.infer<typeof fkUploadTokenSchema>;

export async function getUserProfile(token: string): Promise<fkUser> {
  return APIGET<fkUser>({
    endpoint: "user",
    token,
    reloadCache: true,
    validator: fkUserSchema.parse,
  });
}

export async function getOrg(orgID: number): Promise<fkOrg> {
  return APIGET<fkOrg>({ endpoint: `organization/${orgID}`, validator: fkOrgSchema.parse });
}

export async function getCategories(): Promise<fkCategory[]> {
  const categories = await APIGET<fkCategoryQuery>({
    endpoint: "categories/",
    validator: fkCategoryQuerySchema.parse,
  });
  return categories.results;
}

export function getUploadToken(videoID: number, token: string): Promise<fkUploadToken> {
  return APIGET<fkUploadToken>({
    endpoint: `videos/${videoID}/upload_token`,
    token,
    validator: fkUploadTokenSchema.parse,
  });
}

export const getUserToken = async (email: string, password: string): Promise<string> => {
  const authToken = base64.encode(`${email}:${password}`);
  const r = await fetch(`${configs.api}obtain-token`, {
    headers: {
      Authorization: `Basic ${authToken}`,
    },
  });

  if (r.ok) {
    const retData = (await r.json()) as { key: string };
    return retData.key;
  }

  if (r.status === 401) {
    throw new Error("Ugyldig brukernavn eller passord");
  } else {
    throw new Error("Teknisk feil, vennligst prøv igjen senere");
  }
};
