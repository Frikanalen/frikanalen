import Layout from '../components/Layout';
import WindowWidget from '../components/WindowWidget';
import * as env from '../components/constants';

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

export default function About() {
  return (
  <Layout>
  <WindowWidget invisible nomargin>
      <Card bg="primary" text="light">
      <Card.Body>
      <Card.Title>Målet med Frikanalen er å styrke ytringsfrihet og
	  deltakerdemokratiet gjennom å gi flere mulighet til å ytre seg
	  gjennom TV-mediet.</Card.Title>
      <Card.Text className="d-flex justify-content-end">
		<p>Frikanalens formålsparagraf</p>
      </Card.Text>
      </Card.Body>
      </Card> 
  </WindowWidget>
  <WindowWidget>
      <h2>Frikanalen er sivilsamfunnets videoplatform.</h2>
      <p>Vi ønsker i samarbeid med våre medlemsorganisasjoner utvikle en
      videoplattform uten forhåndssensur, tilrettelagt for behovene til norsk
	  demokrati, organisasjonsliv og frivillighet.</p>
      <p>Vi tilbyr alle våre medlemmer adgang til en riksdekkende TV-kanal med
      formidlingsplikt - som vil si at alle kabelleverandører er på samme måte
      som NRK, forpliktet til å bære vår kanal.</p>
      <p>Etter et omfattende frivillig arbeid vurderer vi vår kanal stabil nok
      til å ta kontakt med tilbydere. Vi er allerede båret av RiksTV, og er i
      forhandlinger med Telia og Telenor om å få vår kanal båret av dem.</p>
      <p>Det pågår også et arbeide med å tilrettelegge for brukerstyrte
      direktesendinger rett ut til vår TV-kanal. I tillegg til dette er vi i
      full gang med å utvikle en god løsning for spredning av video på
      nett. Så følg med!</p>
  </WindowWidget>
  </Layout>
  );
}
