import { css } from "@emotion/react";
import styled from "@emotion/styled";

const Container = styled.span<{ type: StatusType }>`
  font-size: 0.9em;
  font-weight: 600;

  ${(props) => {
    if (props.type === "error") {
      return css`
        color: ${props.theme.color.secondAccent};
      `;
    }

    return css`
      color: ${props.theme.fontColor.muted};
    `;
  }}
`;

export type StatusType = "info" | "error";

export type StatusLineProps = {
  type: StatusType;
  message?: string;
  className?: string;
};

export function StatusLine(props: StatusLineProps) {
  const { type, className, message } = props;
  if (!message) return null;

  return (
    <Container className={className} type={type}>
      {message}
    </Container>
  );
}
