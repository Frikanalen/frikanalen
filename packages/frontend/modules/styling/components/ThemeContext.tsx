import { ThemeProvider } from "@emotion/react";
import { useCookie } from "modules/state/hooks/useCookie";
import React from "react";
import { lightTheme } from "../themes";

export type ThemeType = "light" | "dark";

// NAMING THINGS IS HARD
export type ThemeContextContext = {
  type: ThemeType;
  toggle: () => void;
};

export const context = React.createContext<ThemeContextContext>({
  type: "light",
  toggle: () => {},
});

export function ThemeContext(props: React.PropsWithChildren<{}>) {
  const { children } = props;
  const [type, setType] = useCookie<ThemeType>("theme", "light");

  return (
    <ThemeProvider theme={type === "light" ? lightTheme : lightTheme}>
      <context.Provider value={{ type, toggle: () => setType(type === "light" ? "dark" : "light") }}>
        {children}
      </context.Provider>
    </ThemeProvider>
  );
}
