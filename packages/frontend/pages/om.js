import Link from 'next/link';
import Layout from '../components/Layout';
import * as env from '../components/constants';
import Container from 'react-bootstrap/Container'

export var about_render = (data) => {
    return (
    <Layout>
    <Container className="about-text">
        {data}
            <style jsx global>{`

            .about-text {
                color: #eee;
                background: #333131;
            }

            h2 {
                color: white;
            }

            p {
                color: #ddd;
            }
            `}</style>
	</Container>
        </Layout>
    )

}

export default function About() {
  return about_render(
      <div>
      <div id="vedtektsitat">
      <p id="quote">Målet med Frikanalen er å styrke ytringsfriheten og det deltakende
      demokratiet gjennom å gi flere mulighet til å ytre seg gjennom TV-mediet.</p>
      <p id="cite">Frikanalens formålsparagraf</p>
      </div>
      <div id="blurb">
      <h2>Frikanalen er sivilsamfunnets videoplatform.</h2>
      <p>Vi ønsker i samarbeide med våre medlemsorganisasjoner utvikle en
      videoplattform tilrettelagt for behovene til norsk organisasjonsliv og
      frivillighet, uten forhåndssensur.</p>
      <p>Vi tilbyr alle våre medlemmer adgang til en riksdekkende TV-kanal med
      formidlingsplikt - som vil si at alle kabelleverandører er på samme måte
      som NRK, forpliktet til å bære vår kanal.</p>
      <p>Etter et omfattende frivillig arbeide vurderer vi vår kanal stabil nok
      til å ta kontakt med tilbydere. Vi er allerede båret av RiksTV, og er i
      forhandlinger med Telia og Telenor om å få vår kanal båret av dem.</p>
      <p>Det pågår også et arbeide med å tilrettelegge for brukerstyrte
      direktesendinger rett ut til vår TV-kanal. I tillegg til dette er vi i
      full gang med å utvikle en god løsning for spredning av video på
      nett. Så følg med!</p>
      </div>
      <style jsx>{`
            #vedtektsitat {
                background: white;
                opacity: 0.8;
                color: black;
                padding: 3px 20px;
                font-size: 20px;
                margin-top: 15px;
                min-width: 100%;
            }

            #quote {
               font-style: italic; 
            }

            #cite {
               text-align: right;
               margin-right: 30px;
               opacity: 0.8;
               }
      `}</style>
      </div>
  );
}
