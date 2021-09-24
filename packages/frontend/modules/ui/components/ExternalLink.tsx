import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const Container = styled.a`
  color: ${(props) => props.theme.color.accent};

  &:hover {
    text-decoration: underline;
  }
`;

export type ExternalLinkProps = PropsWithChildren<{
  href: string;
}>;

export function ExternalLink(props: ExternalLinkProps) {
  const { href, children } = props;

  return (
    <Container href={href} target="_blank" rel="noopener">
      {children}
    </Container>
  );
}
