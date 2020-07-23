import Link from 'next/link';
import Header from './Header';
import MetaTags from 'react-meta-tags';

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const Layout = props => (
    <Container>
    <MetaTags>
        <title>Frikanalen</title>
    </MetaTags>
    <Row>
    <Header className="foo"/>
    </Row>
    <Row>
    {props.children}
    </Row>
    <Footer />
    <style jsx>{`
    `}</style>
    <style jsx global>{`
        @font-face {
          font-family: 'Material Icons';
          font-style: normal;
          font-weight: 400;
          src: url(/fonts/MaterialIcons.ttf) format('truetype');
        }

        .material-icons {
          font-family: 'Material Icons';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
        }
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('Roboto'), local('Roboto-Regular'), url(/fonts/Roboto400.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: local('Roboto Bold'), local('Roboto-Bold'), url(/fonts/Roboto700.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 900;
          font-display: swap;
          src: local('Roboto Black'), local('Roboto-Black'), url(/fonts/Roboto900.ttf) format('truetype');
        }

        video {
            width: 100%;
        }
        html, body {
            background: #b6b6b6;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        a, a:link {
            text-decoration: none;
            color:inherit;
        }

        header {
            width: 100%;
            margin-bottom: 20px;
            background: #fff;
        }
        @media screen and (max-width: 1024px) {
        }
`}</style>
    </Container>
);

const Footer = props => (
    <footer className="fixed-bottom">
        <a href="https://frikanalen.no/api/">REST API</a>&nbsp;|&nbsp;
        <a href="https://frikanalen.no/xmltv/">XMLTV</a>&nbsp;|&nbsp;
        <a href="http://github.com/Frikanalen">Source code</a>
        &nbsp;&copy; 2009-2020 Foreningen Frikanalen
    <style jsx global >{`
        footer {
            display: block;
            width: 100%;

            background-color: rgba(255, 255, 255, 0.8);
            color: rgba(0, 0, 0, 0.5);

            font-style: italic;
            text-align: center;
        }
        `}</style>
    </footer>

)

export default Layout;
