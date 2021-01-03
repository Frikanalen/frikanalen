import { useContext } from "react";
import configs from "../configs";
import * as z from "zod";

export interface fkBulletin {
  id: number;
  heading: string;
  text: string;
}

interface fkOrgRoleJSON {
  role: string;
  organization_id: number;
  organization_name: string;
}

export interface fkVideoFiles {
  large_thumb: string;
  theora: string;
}

export interface fkVideoJSON {
  id: number;
  organization: fkOrgJSON;
  publish_on_web: boolean;
  files: fkVideoFiles;
}

function fkVideoJSONValidator(data: any) {
  return data as fkVideo;
}

export interface fkVideo {
  id: number;
  name: string;
  organization: fkOrgJSON;
}

export interface fkScheduleJSON {
  results: fkScheduleItem[];
}

export interface fkOrg {
  orgID: number;
  orgName: string;
  orgDescription: string;
  postalAddress: string;
  streetAddress: string;
  editorID: number;
  editorName: string;
  editorEmail: string;
  editorMSISDN: string;
  isMember: boolean;
}

export const fkOrgJSONSchema = z.object({
  id: z.number(),
  name: z.string(),
  postal_address: z.string(),
  street_address: z.string(),
  editor_id: z.number(),
  editor_name: z.string(),
  editor_email: z.string(),
  editor_msisdn: z.string(),
  homepage: z.string().nullable(),
  fkmember: z.boolean(),
  description: z.string(),
});

export type fkOrgJSON = z.infer<typeof fkOrgJSONSchema>;

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
    return responseJSON as T;
  }
}

export async function fkFetchOrg(orgID: number): Promise<fkOrg> {
  const o = await APIGET<fkOrgJSON>({ endpoint: `organization/${orgID}` });

  return {
    orgID: o.id,
    orgName: o.name,
    orgDescription: o.description,
    postalAddress: o.postal_address,
    streetAddress: o.street_address,
    isMember: o.fkmember,
    editorID: o.editor_id,
    editorName: o.editor_name,
    editorEmail: o.editor_email,
    editorMSISDN: o.editor_msisdn,
  };
}

export interface fkOrgRole {
  role: string;
  orgID: number;
  orgName: string;
}

interface fkUserJSON {
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  phone_number: string;
  organization_roles: fkOrgRoleJSON[];
}

export type fkScheduleItem = {
  id: number;
  video: fkVideo;
  starttime: string;
  endtime: string;
};

export interface fkUser {
  readonly email: string;
  firstName: string;
  lastName: string;
  msisdn: string;
  isStaff: boolean;
  organizationRoles: fkOrgRole[];
}

export async function getUserProfile(token: string): Promise<fkUser> {
  const userJSON = await APIGET<fkUserJSON>({ endpoint: "user", token: token, reloadCache: true });

  const orgRoles: fkOrgRole[] = userJSON.organization_roles.map((role) => {
    return {
      role: role.role,
      orgID: role.organization_id,
      orgName: role.organization_name,
    };
  });

  return {
    email: userJSON.email,
    isStaff: userJSON.is_staff,
    firstName: userJSON.first_name,
    lastName: userJSON.last_name,
    msisdn: userJSON.phone_number,
    organizationRoles: orgRoles,
  };
}
