import styled from "@emotion/styled";
import { IconType } from "../types";
import { SVGIcon } from "./SVGIcon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
`;

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  font-size: 1.1em;
  font-weight: 500;

  margin-top: 8px;
  margin-bottom: 32px;
`;

const Icon = styled(SVGIcon)`
  color: ${(props) => props.theme.fontColor.subdued};
  width: 64px;
  height: 64px;

  margin-bottom: 32px;
`;

export type EmptyStateProps = {
  icon: IconType;
  title: string;
  subtitle: string;
};

export function EmptyState(props: EmptyStateProps) {
  const { icon, title, subtitle } = props;

  return (
    <Container>
      <Icon name={icon} />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}
