import styled from "@emotion/styled";
import { ExternalLink } from "modules/ui/components/ExternalLink";
import { SVGIcon } from "modules/ui/components/SVGIcon";
import { CONTENT_WIDTH } from "../constants";

export const Container = styled.footer`
  margin-top: 32px;
  margin-bottom: 32px;

  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  max-width: ${CONTENT_WIDTH}px;
  width: 100%;

  display: flex;
`;

const Copyright = styled.span`
  flex: 1;
  color: ${(props) => props.theme.fontColor.muted};
`;

const Links = styled.nav``;

const Link = styled(ExternalLink)`
  margin-left: 16px;
`;

export function Footer() {
  return (
    <Container>
      <Content>
        <Copyright>© 2009 - {new Date().getFullYear()} Foreningen Frikanalen</Copyright>
        <Links>
          <Link href="https://github.com/Frikanalen/frikanalen">GitHub</Link>
          <Link href="https://frikanalen.no/api/">API</Link>
          <Link href="https://frikanalen.no/xmltv/">XMLTV</Link>
        </Links>
      </Content>
    </Container>
  );
}
