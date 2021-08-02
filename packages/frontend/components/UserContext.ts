import { createContext } from "react";
import { fkUser } from "./TS-API/API";

export type UserContextLoggedInState = {
  isReady: true
  isLoggedIn: true;
  login: (token: string) => void;
  token: string;
  profile: fkUser;
  logout: () => any;
  refresh: (authToken: string) => void;
};

export type UserContextUninitializedState = {
  isReady: false
  isLoggedIn: false;
};

export type UserContextUnauthState = {
  isReady: true
  isLoggedIn: false;
  login?: (token: string) => void;
};

export type UserContextState = UserContextLoggedInState | UserContextUnauthState | UserContextUninitializedState;

export const UserContext = createContext<UserContextState>({
  isLoggedIn: false,
  isReady: false
});
