import { css } from "@emotion/react";
import { CONTENT_WIDTH, CONTENT_WIDTH_PADDING } from "../constants";

export const mainContentStyle = css`
  max-width: ${CONTENT_WIDTH}px;
  width: 100%;

  @media (max-width: ${CONTENT_WIDTH + CONTENT_WIDTH_PADDING}px) {
    max-width: 100%;
    width: 100%;

    padding: 0px 24px;
  }
`;
