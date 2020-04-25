import Layout from '../components/Layout';
import LiveNow from '../components/LiveNow';

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
export default function index() {
  return (
    <Layout>
      <div id="betaDisclaimer">
          <div id="logo">
             <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div id="text">
              <h1>Velkommen til nye frikanalen.no!</h1>
              <p>Etter mye hardt arbeide bak scenene kan vi endelig presentere
              første versjon av nye frikanalen.no.</p>
              <p> Det er i første omgang nødvendig å bruke <a
                href="http://frikanalen.no/">de gamle nettsidene</a> for å laste opp
                innhold, eller se i videoarkivet.</p>
              <p>De eksisterende funksjonene vil bli implementert fortløpende
              på den nye siden!</p>
          </div>
      </div>
      <LiveNow/>
      <style jsx>{`
        #betaDisclaimer {
            background-color: black;
            opacity: .6;
            color: white;
            display: grid;
            grid-template-areas: "logo text";
            margin-bottom: 20px;
        }
        #logo {
            grid-area: "logo";
            align-self: center;
            justify-self: center;
            padding: 50px;
        }
        #logo>svg {
            fill: yellow;
            width: 100px;
            height: 100px;
        }
        #text {
            grid-area: "text";
            padding-left: 0px;
            padding-right: 20px;
            font-family: 'Roboto', sans-serif;
            }
        a {
            color: #aaaaff;
            text-decoration: underline;
        }
      `}</style>
      <style jsx global>{`
      main {
        padding-top: 20px;
      }
      `}</style>
    </Layout>
  );
}
