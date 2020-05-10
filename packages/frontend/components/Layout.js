import Link from 'next/link';
import Header from './Header';
import UserAuth from './UserAuth';
import MetaTags from 'react-meta-tags';

const Layout = props => (
  <div className="page">
    <MetaTags>
        <title>Frikanalen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </MetaTags>
      <link href="scripts/video-js.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="style/controls.css" />
    <Header className="foo"/>
    <main>{props.children}</main>
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

        * {
          box-sizing: border-box;
}
        body > div:first-child,
          div#__next,
          div#__next > div,
          div#__next > div > div {
            height: 100%;
            padding: 0;
          }
        .page {
            min-height: 100%;
            display: grid; 
            grid-template-layout: "header header header"
                                    ". content ."
                                    "footer footer footer";
            grid-template-rows: auto 1fr auto;
            grid-template-columns: 100%;
        }
        video {
        width: 100%;
        }
        main {
            max-width: 100%;
            width: 1024px;
            margin: 0 auto;
            padding-top: 20px;
            grid-template-area: content;
        }
        header {
            grid-template-area: header;
            max-width: 1024px;
            width: 100%;
            margin: 0 auto;
            margin-top: 100px;
            background: #fff;
        }
        footer {
            margin-top: 30px;
            grid-template-area: footer;
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

        @media screen and (max-width: 1024px) {
            header {
                margin-top: 0px;
            }
            main {
                padding-top: 5px;
            }
        }
`}</style>
  </div>
);

const Footer = props => (
    <footer>
        <p>
        <a href="https://frikanalen.no/api/">REST API</a>&nbsp;|&nbsp;
        <a href="https://frikanalen.no/xmltv/">XMLTV</a>&nbsp;|&nbsp;
        <a href="http://github.com/Frikanalen">Source code</a>
        &nbsp;&copy; 2009-2020 Foreningen Frikanalen
        </p>
    <style jsx>{`
        footer {
            font-size: 75%;
            font-style: italic;
            text-align: center;
        }

        footer p {
            width: 100%;
            margin: 0;
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            background-color: rgba(255, 255, 255, 0.8);
        }
        `}</style>
    </footer>

)

export default Layout;
