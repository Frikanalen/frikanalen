import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const Container = styled.a`
  color: ${(props) => props.theme.color.accent};

  &:hover {
    text-decoration: underline;
  }
`;

export type ExternalLinkProps = PropsWithChildren<{
  className?: string;
  href: string;
}>;

export function ExternalLink(props: ExternalLinkProps) {
  const { className, href, children } = props;

  return (
    <Container className={className} href={href} target="_blank" rel="noopener">
      {children}
    </Container>
  );
}
