import Link from 'next/link';
import Header from './Header';
import UserAuth from './UserAuth';

const Layout = props => (
  <div className="page">
    <Header className="foo"/>
    <main>{props.children}</main>
    <Footer />
    <style jsx>{`
    `}</style>
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto:900&display=swap');
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
            margin: 0 4%;
            grid-template-area: content;
        }
        header {
            grid-template-area: header;
            margin-bottom: 20px;
        }
        footer {
            grid-template-area: footer;
        }
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        a img {
            border: none;
        }
        a:link {
            color: rgb(70, 43, 3);
        }
        a:visited {
            color: rgb(42, 26, 2);
            color: rgba(70, 73, 3, 0.6);
        }
        a:hover {
            color: rgb(42, 26, 2);
            color: rgba(70, 43, 3, 0.6);
        }
        a:active {
            color: rgb(70, 43, 3);
        }

        body {
            font-family: Arial,Helvetica,"Bitstream Vera Sans",sans-serif;
        }
        h1 {
            color: #555;
            font-size: 24px;
            margin: 0 0 6px;
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
            background-color: rgb(204, 204, 204);
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 16px 16px 0 0;
        }
        `}</style>
    </footer>

)

export default Layout;
