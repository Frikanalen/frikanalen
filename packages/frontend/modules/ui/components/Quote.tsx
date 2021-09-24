import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import { ExternalLink } from "./ExternalLink";

const Container = styled.figure`
  margin: 24px 0px;
`;

const Block = styled.blockquote`
  font-size: 1.2em;
  font-style: italic;

  color: ${(props) => props.theme.fontColor.muted};
`;

const Caption = styled.figcaption`
  margin-top: 8px;
`;

export type QuoteProps = PropsWithChildren<{
  className?: string;
  citation: {
    name: string;
    href: string;
  };
}>;

export function Quote(props: QuoteProps) {
  const { className, children, citation } = props;

  return (
    <Container className={className}>
      <Block cite={citation.href}>«{children}»</Block>
      <Caption>
        — <ExternalLink href={citation.href}>{citation.name}</ExternalLink>
      </Caption>
    </Container>
  );
}
