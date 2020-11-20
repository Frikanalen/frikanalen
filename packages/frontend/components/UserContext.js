import { createContext } from "react";

export const UserContext = createContext({
  token: null,
  profile: null,
  login: (token) => {},
  logout: () => {},
  refresh: () => {},
});
