import React from "react";
import Alert from "react-bootstrap/Alert";
import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

export default function Blimed() {
  return (
    <Layout>
      <WindowWidget>
        <Alert variant="info">
          <h3>Du er tidlig ute!</h3>
          <p>Denne nettsiden er under aktiv utvikling.</p>
          <p>
            Se «<a href="/om/kontakt">Kontakt oss</a>» for informasjon om kontingent og
            innmelding.
          </p>
        </Alert>
        <h2>Bli med!</h2>
        <p>
          Alle individer og ikke-kommersielle organisasjoner kan tegne medlemskap i Frikanalen og få sitt innhold sendt på
          riksdekkende fjernsyn.
        </p>
        <p>Slik går du frem:
          <ul>
            <li><a>Opprett en bruker på denne nettsiden</a></li>
            <li><a>Fra din brukerprofil, opprett en ny organisasjon</a></li>
          </ul>
        </p>
      </WindowWidget>
    </Layout>
  );
}
