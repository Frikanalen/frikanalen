import { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { IconType } from "../types";
import { SVGIcon } from "./SVGIcon";

const typeToIconMap: Record<NoticeType, IconType> = {
  tip: "lightbulb",
};

const typeToColorMap: Record<NoticeType, keyof Theme["color"]> = {
  tip: "secondAccent",
};

const Container = styled.div<{ type: NoticeType }>`
  display: flex;
  align-items: center;

  background: ${(props) => props.theme.color[typeToColorMap[props.type]]};
  color: ${(props) => props.theme.fontColor.muted};

  padding: 14px 16px;
  border-radius: 4px;
`;

const Icon = styled(SVGIcon)`
  width: 24px;
  height: 24px;

  margin-right: 16px;
`;

const Message = styled.span`
  font-size: 0.9em;
  font-weight: 600;
`;

export type NoticeType = "tip";

export type NoticeProps = {
  className?: string;
  type: NoticeType;
  message: string;
};

export function Notice(props: NoticeProps) {
  const { type, message, className } = props;

  return (
    <Container className={className} type={type}>
      <Icon name={typeToIconMap[type]} />
      <Message>{message}</Message>
    </Container>
  );
}
