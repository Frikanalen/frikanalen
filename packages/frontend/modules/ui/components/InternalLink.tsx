import styled from "@emotion/styled";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { linkStyle } from "../styles/linkStyle";

const Container = styled.a`
  ${linkStyle}
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
