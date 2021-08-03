import { createContext } from "react";
import { fkUser } from "./TS-API/API";

export type UserContextLoggedInState = {
  isReady: true
  isLoggedIn: true;
  login: (token: string) => void;
  token: string;
  profile: fkUser;
  logout: () => void;
  refresh: (authToken: string) => void;
};

export type UserContextUnauthState = {
  isLoggedIn: false;
  login?: (token: string) => void;
};

export type UserContextState = UserContextLoggedInState | UserContextUnauthState;

export const UserContext = createContext<UserContextState>({
  isLoggedIn: false,
  // eslint-disable-next-line no-unused-vars
  login: (token: string): void => void {}
});
