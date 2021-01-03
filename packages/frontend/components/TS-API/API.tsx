import { useContext } from "react";
import configs from "../configs";

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

export interface fkOrgJSON {
  id: number;
  name: string;
  postal_address: string;
  street_address: string;
  editor_id: number;
  editor_name: string;
  editor_email: string;
  editor_msisdn: string;
  fkmember: boolean;
  description: string;
}

export async function APIGET<T>(
  endpoint: string,
  token: string | null = null,
  reloadCache: boolean = false
): Promise<T> {
  let authHeaders = {};
  let cacheOptions = "default" as RequestCache;
  if (token) authHeaders = { Authorization: `Token ${token}` };
  if (reloadCache) cacheOptions = "reload" as RequestCache;

  const response = await fetch(`${configs.api}${endpoint}`, { cache: cacheOptions, headers: authHeaders });

  if (response.ok) return await response.json();

  throw Error(response.statusText);
}

export async function fkFetchOrg(orgID: number): Promise<fkOrg> {
  const o = await APIGET<fkOrgJSON>(`organization/${orgID}`);

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
  const userJSON = await APIGET<fkUserJSON>("user", token, true);

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
