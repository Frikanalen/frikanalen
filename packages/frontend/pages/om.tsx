import React from "react";
import Card from "react-bootstrap/Card";
import Layout from "../components/Layout";
import WindowWidget from "../components/WindowWidget";

export default function About(): JSX.Element {
  return (
    <Layout>
      <WindowWidget invisible nomargin>
        <Card bg="primary" text="light">
          <Card.Body>
            <Card.Title>
              Målet med Frikanalen er å styrke ytringsfrihet og deltakerdemokratiet ved å gi flere mulighet til å ytre
              seg i TV-mediet.
            </Card.Title>
            <Card.Text className="d-flex justify-content-end">
              <p>Frikanalens formålsparagraf</p>
            </Card.Text>
          </Card.Body>
        </Card>
      </WindowWidget>
      <WindowWidget>
        <h2>Frikanalen er sivilsamfunnets videoplatform.</h2>
        <p>
          Vi ønsker i samarbeid med våre medlemsorganisasjoner utvikle en videoplattform uten forhåndssensur,
          tilrettelagt for behovene til norsk demokrati, organisasjonsliv og frivillighet.
        </p>
        <p>
          Vi tilbyr alle våre medlemmer adgang til en riksdekkende TV-kanal med formidlingsplikt - som vil si at alle
          kabelleverandører er forpliktet til å bære vår kanal, på samme måte som NRK.
        </p>
        <p>
          Etter et omfattende frivillig arbeid har vi vurdert vår kanal stabil nok til å ta kontakt med tilbydere. Vi er
          nå på RiksTV og Telenor (Te-We), og i forhandlinger med Telia.
        </p>
        <p>
          Det pågår også et arbeide med å tilrettelegge for brukerstyrte direktesendinger rett ut til vår TV-kanal. I
          tillegg til dette er vi i full gang med å utvikle en god løsning for spredning av video på nett. Så følg med!
        </p>
      </WindowWidget>
    </Layout>
  );
}
