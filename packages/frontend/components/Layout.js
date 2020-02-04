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
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>
    <Header className="foo"/>
    <main>{props.children}</main>
    <Footer />
    <style jsx>{`
    `}</style>
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto:400,700,900&display=swap');

        * {
          box-sizing: border-box;
}
        body > div:first-child,
          div#__next,
          div#__next > div,
          div#__next > div > div {
            height: 100%;
            box-sizing: border-box;
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
        main {
            max-width: 100%;
            width: 1024px;
            margin: 0 auto;
            padding-top: 60px;
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
            grid-template-area: footer;
        }
        html, body {
            background: #e7e7e7;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
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
            padding: 0;
            padding-top: 0.5em;
            height: 1.5em;
            background-color: rgba(255, 255, 255, 0.8);
        }
        `}</style>
    </footer>

)

export default Layout;
