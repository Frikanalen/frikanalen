import { createContext } from "react";
import {fkOrgRole} from "./TS-API/API";

export interface Profile {
  msisdn: string,
  email: string,
  firstName: string,
  lastName: string,
  organizationRoles: fkOrgRole[],
  isStaff: boolean
}

export type UserContextState = {
  isLoggedIn: false,
  login: (token: string) => void
} | {
  isLoggedIn: true,
  token: string,
  profile: Profile,
  logout: () => any,
  refresh: () => any
}

export const UserContext = createContext<UserContextState>({
  isLoggedIn: false,
  login: (token) => {}
});
