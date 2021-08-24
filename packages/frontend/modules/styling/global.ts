import { css, Theme } from "@emotion/react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

export const global = (theme: Theme) => css`
  body,
  html {
    margin: 0;
    padding: 0;

    font-family: "Roboto", sans-serif;
    color: ${theme.fontColor.normal};
  }

  a {
    color: ${theme.fontColor.normal};
    text-decoration: none;
  }
`;
