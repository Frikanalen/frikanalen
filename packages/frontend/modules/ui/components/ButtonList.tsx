import { css } from "@emotion/react";
import styled from "@emotion/styled";

/** Consistent spacing of buttons */
export const ButtonList = styled.div<{ horizontal?: boolean; compact?: boolean }>`
  ${(props) => {
    const { horizontal, compact } = props;

    const spacing = compact ? "12px" : "16px";

    const verticalStyle = css`
      > * + * {
        margin-top: ${spacing};
      }
    `;

    const horizontalStyle = css`
      display: flex;
      flex-wrap: wrap;

      > * {
        margin-right: ${spacing};
        margin-bottom: ${spacing};
      }

      margin-right: -${spacing};
      margin-bottom: -${spacing};
    `;

    return horizontal ? horizontalStyle : verticalStyle;
  }}
`;
