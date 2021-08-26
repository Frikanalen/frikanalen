import { css, Theme } from "@emotion/react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

export const global = (theme: Theme) => css`
  * {
    box-sizing: border-box;
  }

  body,
  html {
    margin: 0;
    padding: 0;

    font-family: "Roboto", sans-serif;
    color: ${theme.fontColor.normal};

    font-size: 16px;
  }

  body {
    overflow-y: scroll;
  }

  a {
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-top: 0px;
    line-height: initial;
  }

  h2 {
    font-weight: 700;
    font-size: 2em;
  }

  p {
    font-size: 1em;
  }

  button {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    color: inherit;
    text-align: inherit;
    box-sizing: inherit;
    cursor: pointer;
    font: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;
