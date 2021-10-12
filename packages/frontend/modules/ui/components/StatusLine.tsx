import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Fragment, useEffect, useRef, useState } from "react";
import { IconType } from "../types";
import { Spinner } from "./Spinner";
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

const Loading = styled(Spinner)`
  margin-right: 8px;
`;

const statusTimeout = 5000;

const typeToIconMap: Record<StatusType, IconType | undefined> = {
  loading: undefined,
  info: undefined,
  success: "circledCheckmark",
  error: "triangularExclamation",
};

export type StatusType = "info" | "loading" | "success" | "error";

export type StatusLineProps = {
  type: StatusType;
  fingerprint: number;
  message?: string;
  className?: string;
};

export function StatusLine(props: StatusLineProps) {
  const { type, className, message, fingerprint } = props;
  const icon = typeToIconMap[type];

  const timeoutRef = useRef<number>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, statusTimeout);

    setVisible(true);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [fingerprint]);

  const renderSpinner = () => {
    if (type !== "loading") return null;

    return <Loading size="small" />;
  };

  const renderIcon = () => {
    if (!icon) return null;

    return <Icon name={icon} />;
  };

  const renderStatus = () => {
    if (!visible) return null;

    return (
      <Fragment key={type + message}>
        {renderSpinner()}
        {renderIcon()}
        {message}
      </Fragment>
    );
  };

  return (
    <Container className={className} type={type}>
      {renderStatus()}
    </Container>
  );
}
