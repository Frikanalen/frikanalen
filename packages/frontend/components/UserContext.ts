import { createContext } from "react";
import { fkUser } from "./TS-API/API";

export type UserContextState =
  | {
      isLoggedIn: false;
      login: (token: string) => void;
    }
  | {
      isLoggedIn: true;
      token: string;
      profile: fkUser;
      logout: () => any;
      refresh: () => any;
    };

export const UserContext = createContext<UserContextState>({
  isLoggedIn: false,
  login: (token) => {},
});
