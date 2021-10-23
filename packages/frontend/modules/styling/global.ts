import { css, Theme } from "@emotion/react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

export const global = (theme: Theme) => css`
  * {
    box-sizing: border-box;
  }

  /** Remove this when bootstrap is removed **/
  html {
    scroll-behavior: revert !important;
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
    background: ${theme.color.background};
    overflow-y: scroll;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  figure,
  figcaption,
  li,
  ul,
  ol,
  blockquote {
    margin: 0;
    padding: 0;
    margin-top: 0px;
    list-style: none;
    line-height: initial;
  }

  h1 {
    font-size: 1.8em;
  }

  h2 {
    font-weight: 700;
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.2em;
    font-weight: 600;
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

  input,
  label,
  select,
  button,
  textarea {
    margin: 0;
    border: 0;
    padding: 0;
    display: inline-block;
    vertical-align: middle;
    white-space: normal;
    background: none;
    line-height: 1;
  }
`;
