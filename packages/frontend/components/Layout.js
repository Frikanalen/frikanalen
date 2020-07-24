import Link from 'next/link';
import Header from './Header';
import MetaTags from 'react-meta-tags';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const Footer = () => (
    <footer className="fixed-bottom">
        <a href="https://frikanalen.no/api/">REST API</a>&nbsp;|&nbsp;
        <a href="https://frikanalen.no/xmltv/">XMLTV</a>&nbsp;|&nbsp;
        <a href="http://github.com/Frikanalen">Source code</a>
        &nbsp;&copy; 2009-2020 Foreningen Frikanalen
    </footer>
)

const Layout = props => (
    <Container fluid>
    <MetaTags>
        <title>Frikanalen</title>
    </MetaTags>
    <Row>
    <Header/>
    </Row>
    <Row>
    <Col className={"mainColumn"}>
    {props.children}
    </Col>
    </Row>
    <Footer />
    <style jsx>{`
    .mainColumn {
        padding: 0;
        margin: 0;
    }`}</style>
    </Container>
);

export default Layout;
