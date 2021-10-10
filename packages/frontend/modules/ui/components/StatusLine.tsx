import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconType } from "../types";
import { SVGIcon } from "./SVGIcon";

const Container = styled.span<{ type: StatusType }>`
  display: flex;
  align-items: center;

  font-size: 0.8em;
  font-weight: 600;

  ${(props) => {
    if (props.type === "error") {
      return css`
        color: ${props.theme.stateColor.danger};
      `;
    }

    if (props.type === "success") {
      return css`
        color: ${props.theme.stateColor.success};
      `;
    }

    return css`
      color: ${props.theme.fontColor.muted};
    `;
  }}
`;

const Icon = styled(SVGIcon)`
  width: 24px;
  height: 24px;

  margin-right: 8px;
`;

const typeToIconMap: Record<StatusType, IconType | undefined> = {
  info: undefined,
  success: "circledCheckmark",
  error: "triangularExclamation",
};

export type StatusType = "info" | "success" | "error";

export type StatusLineProps = {
  type: StatusType;
  message?: string;
  className?: string;
};

export function StatusLine(props: StatusLineProps) {
  const { type, className, message } = props;
  const icon = typeToIconMap[type];

  const renderIcon = () => {
    if (!icon) return null;

    return <Icon name={icon} />;
  };

  return (
    <Container className={className} type={type}>
      {renderIcon()}
      {message}
    </Container>
  );
}
