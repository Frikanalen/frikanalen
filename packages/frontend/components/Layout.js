import Link from "next/link";
import Header from "./Header";
import MetaTags from "react-meta-tags";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

const Footer = () => (
  <footer className="d-none d-lg-block fixed-bottom">
    <a href="https://frikanalen.no/api/">REST API</a>&nbsp;|&nbsp;
    <a href="https://frikanalen.no/xmltv/">XMLTV</a>&nbsp;|&nbsp;
    <a href="http://github.com/Frikanalen">Source code</a>
    &nbsp;&copy; 2009-2020 Foreningen Frikanalen
  </footer>
);

const Layout = (props) => (
  <Container fluid className={"mainContainer"}>
    <MetaTags>
      <title>Frikanalen</title>
    </MetaTags>
    <Row noGutters>
      <Header />
    </Row>
    <Row noGutters>
      <Col className={"mainColumn"}>{props.children}</Col>
    </Row>
    <Footer />
    <style jsx global>{`
        .mainContainer {
            padding: 0; !important
        }
    `}</style>
  </Container>
);

export default Layout;
