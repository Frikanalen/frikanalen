import styled from "@emotion/styled";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const Container = styled.a`
  color: ${(props) => props.theme.color.accent};

  &:hover {
    text-decoration: underline;
  }
`;

export type InternalLinkProps = PropsWithChildren<{
  className?: string;
  href: string;
}>;

export function InternalLink(props: InternalLinkProps) {
  const { className, href, children } = props;

  return (
    <Link href={href} passHref>
      <Container className={className}>{children}</Container>
    </Link>
  );
}
