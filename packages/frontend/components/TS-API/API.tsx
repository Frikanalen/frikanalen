import configs from "../configs";
import Cookies from "js-cookie";

interface fkOrgRoleJSON {
  role: string;
  organization_id: number;
  organization_name: string;
}

export interface fkOrg {
  orgID: number;
  orgName: string;
}

interface fkOrgRole {
  role: string;
  orgID: number;
  orgName: string;
}

interface fkUserJSON {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  organization_roles: fkOrgRoleJSON[];
}

export interface fkUser {
  readonly email: string;
  firstName: string;
  lastName: string;
  msisdn: string;
  organizationRoles: fkOrgRole[];
}

async function APIGET<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${configs.api}${endpoint}`, {
    headers: {
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });

  return await response.json();
}

export async function getUserProfile(): Promise<fkUser> {
  const userJSON = await APIGET<fkUserJSON>("user");

  let orgRoles = [];

  userJSON.organization_roles.forEach((role) => {
    orgRoles.push({
      role: role.role,
      orgID: role.organization_id,
      orgName: role.organization_name,
    });
  });

  let user: fkUser = {
    email: userJSON.email,
    firstName: userJSON.first_name,
    lastName: userJSON.last_name,
    msisdn: userJSON.phone_number,
    organizationRoles: orgRoles,
  };

  return user;
}
