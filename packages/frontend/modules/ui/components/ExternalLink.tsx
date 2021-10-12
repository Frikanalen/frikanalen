import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import { linkStyle } from "../styles/linkStyle";

const Container = styled.a`
  ${linkStyle}
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
