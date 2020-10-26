import WindowWidget from "../../components/WindowWidget";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Layout from "../../components/Layout";
import Row from "react-bootstrap/Row";

export default function About() {
  return (
    <Layout>
      <WindowWidget invisible nomargin>
        <Card bg="primary" text="light" body>
          <h2>Teknikken skrider fremover</h2>
          <em>Tirsdag 25. august, Tore Sinding Bekkedal</em>
        </Card>
      </WindowWidget>
      <WindowWidget invisible nomargin>
        <div className="hello">
          <div className="inner">
            <p className="lead">
              I påvente av bredere distribusjon har mye frivillig innsats blitt
              lagt inn i utvikling.
            </p>
            <p className="lead">
              I denne artikkelen prøver jeg som teknisk leder å forklare
              prioritetene og redegjøre for resultatene.
            </p>
            <p>
              Frikanalen er utelukkende drevet på frivillig basis. Av utviklere
              er det stort sett mest undertegnede. Samtidig står vi ovenfor en
              fantastisk mulighet i form av bredere distribusjon, som naturlig
              nok i seg selv tar opp mesteparten av tiden jeg kan bruke på dette
              prosjektet.
            </p>
            <p>
              Grovt sett har jeg jobbet etter tre prioriteter:
              <ul>
                <li>Reduser teknisk gjeld</li>
                <p>
                  Da Frikanalen ble startet, ble vi forespeilet en årlig støtte
                  over statsbudsjettet på en million kroner året, i tre år. Da
                  støtten forduftet etter første året, satt vi igjen med gjeld
                  tenkt avskrevet over tre år. Uten noe inntektsgrunnlag utover
                  en medlemsbase vi ikke hadde ressursene til å gro og pleie,
                  var driften ofte totalt prekær. Det positive er at vi har lært
                  å vende på hver krone. Men det er dyrekjøpt erfaring. Åresvis
                  med denne historien av prekær drift bærer også med seg store
                  mengder teknisk gjeld.
                </p>{" "}
                <p>
                  For at Frikanalen skal kunne utvikle en platform som tilfredsstiller våre medlemmers behov, er vi derfor helt avhengige av å rekruttere frivillige som kan avlaste meg. Å
                  gjøre koden vår mer forståelig for utenforstående, forenkle
                  deployment ved å flytte drift inn i Kubernetes og ta i bruk
                  kontinuerlig deployment er alle målrettede tiltak for å gjøre
                  Frikanalen et attraktivt prosjekt for godt talent. En
                  riksdekkende TV-kanal og videoplatform drevet på dugnad er jo
                  trossalt ganske unikt og byr på en rekke interessante tekniske
                  problemer.
                </p>
		      <li>Sikre driftsstabilitet</li>
		      <p>Som ikke-kommersiell 
              </ul>
              Uten sammenligning den vesentligste nyheten er at den forrige
              web-løsningen på frikanalen.no er blitt erstattet av en mer
              tidsmessig og attraktiv nettside.
            </p>
            <p>
              Mye tid er spart i at vi fortsetter å bruke Django som backend,
              men eksponerer data igjennom et åpent (og inntil videre primitivt
              og ullent) REST-API. Ved hjelp av NextJS kan man skrive React-kode
              med effektiv mellomlagring, som ruster oss med ytelse for gode
              brukeropplevelser selv med forventet økt belastning.
            </p>
            <p>
              Nøkkelord innen teknikken her er Django REST framework, NextJS,
              React og React-bootstrap
            </p>
            <p>
              Med frontend løskoblet fra backendkoden har utviklingstempoet på
              nettsiden økt dramatisk. React og Bootstrap gjør det svært
              behagelig å utvikle responsiv og god frontend-kode, og som mer
              dagsaktuelt arbeidsredskap vil det bedre tilgangen til frivillige
              med aktuell kompetanse.
            </p>
            <p>
              Automatisk bygging av Docker-pakker med GitHub Actions forenkler
              utrulling av ny programvare. Migrering av tjenester til containere
              på et Kubernetes-cluster skaper et vesentlig mer forutsigbart og
              lettfatttede driftsmiljøer.
            </p>
            <p>
              Vårt bytte til Kubernetes inkluderer også en del andre fordeler.
              Det er ønskelig på sikt at det blir mulig å spinne opp en hel
              instans på Frikanalen i f. eks. GCP, som lar utviklere enkelt
              eksperimentere innenfor komplette testmiljøer, med en streamet
              programutgang.
            </p>
            <p>
              Prioritetene frem mot lanseringen er nå mest publikumsrettet.
              Innsatsen de nærmeste dagene vil fokuseres mest på å gjøre den nye
              nettsiden mer robust. Hvis det skulle vise seg å bli tid til det,
              håper jeg også å kunne gjøre noe utvikling av avviklingssystemet,
              konkret at man automatisk bytter til reserveavspiller i tilfelle
              problemer med hovedavspilleren.
            </p>
          </div>{" "}
        </div>
        <style jsx>{`
          .hello {
            background: #eee;
            padding: 17.5px;
            padding-top: 30px;
          }
          .inner {
            max-width: 800px;
            margin: 0 auto;
          }
        `}</style>
      </WindowWidget>
    </Layout>
  );
}
