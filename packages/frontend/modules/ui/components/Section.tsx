import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import { IconType } from "../types";
import { SVGIcon } from "./SVGIcon";

const Container = styled.section``;

const Header = styled.header`
  display: flex;
  align-items: center;

  margin-bottom: 16px;
`;

const Icon = styled(SVGIcon)`
  width: 20px;
  height: 20px;

  margin-right: 8px;
`;

const Title = styled.h1`
  font-size: 1em;
  font-weight: 500;
`;

export type SectionProps = PropsWithChildren<{
  className?: string;
  title: string;
  icon?: IconType;
}>;

export function Section(props: SectionProps) {
  const { className, title, icon, children } = props;

  const renderIcon = () => {
    if (!icon) return null;

    return <Icon name={icon} />;
  };

  return (
    <Container className={className}>
      <Header>
        {renderIcon()}
        <Title>{title}</Title>
      </Header>
      {children}
    </Container>
  );
}
