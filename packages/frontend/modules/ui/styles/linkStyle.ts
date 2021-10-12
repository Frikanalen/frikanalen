import { css, Theme } from "@emotion/react";

export const linkStyle = (props: { theme: Theme }) => css`
  color: ${props.theme.color.accent};

  &:hover {
    text-decoration: underline;
  }
`;
