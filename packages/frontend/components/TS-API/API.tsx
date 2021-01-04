import configs from "../configs";
import * as z from "zod";

export interface fkBulletin {
  id: number;
  heading: string;
  text: string;
}

export const fkCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type fkCategory = z.infer<typeof fkCategorySchema>;

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
  largeThumb: z.string().optional(),
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
    organization: fkOrgSchema,
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
  validator?: (data: any) => T;
  token?: string;
  reloadCache?: boolean;
}

export async function APIGET<T>(opts: APIGETOptions<T>): Promise<T> {
  let authHeaders = {};
  let cacheOptions: RequestCache = "default";
  if (opts.token != undefined) authHeaders = { Authorization: `Token ${opts.token}` };
  if (opts.reloadCache != undefined) cacheOptions = "reload";
  const response = await fetch(`${configs.api}${opts.endpoint}`, { cache: cacheOptions, headers: authHeaders });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseJSON = await response.json();

  if (opts.validator != undefined) {
    return opts.validator(responseJSON);
  } else {
    console.log("Warning: Used APIGET without validator.");
    return responseJSON as T;
  }
}

export const fkOrgRoleSchema = z.object({
  role: z.string(),
  orgID: z.number(),
  orgName: z.string(),
});

export type fkOrgRole = z.infer<typeof fkOrgRoleSchema>;

export const fkUserSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  msisdn: z.string(),
  isStaff: z.boolean(),
  organizationRoles: z.array(fkOrgRoleSchema),
});

export type fkUser = z.infer<typeof fkUserSchema>;

export async function getUserProfile(token: string): Promise<fkUser> {
  const userJSON = await APIGET<fkUser>({ endpoint: "user", token: token, reloadCache: true });

  const orgRoles: fkOrgRole[] = userJSON.organizationRoles.map((role) => {
    return {
      role: role.role,
      orgID: role.orgID,
      orgName: role.orgName,
    };
  });

  return {
    email: userJSON.email,
    isStaff: userJSON.isStaff,
    firstName: userJSON.firstName,
    lastName: userJSON.lastName,
    msisdn: userJSON.msisdn,
    organizationRoles: orgRoles,
  };
}

export async function getOrg(orgID: number): Promise<fkOrg> {
  return await APIGET<fkOrg>({ endpoint: `organization/${orgID}`, validator: fkOrgSchema.parse });
}
