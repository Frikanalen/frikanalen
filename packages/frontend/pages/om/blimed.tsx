import React from "react";
import Alert from "react-bootstrap/Alert";
import WindowWidget from "../../components/WindowWidget";
import Link from "next/link";

export default function Blimed(): JSX.Element {
  return (
    <>
      <WindowWidget>
        <Alert variant="info">
          <h3>Du er tidlig ute!</h3>
          <p>Denne nettsiden er under aktiv utvikling.</p>
          <p>
            Se «
            <Link href="/om/kontakt">
              <a>Kontakt oss</a>
            </Link>
            » for informasjon om kontingent og innmelding.
          </p>
        </Alert>
        <h2>Bli med!</h2>
        <h3>Som medlem</h3>
        <p>
          Alle individer og ikke-kommersielle organisasjoner kan tegne medlemskap i Frikanalen og få sitt innhold sendt
          på riksdekkende fjernsyn.
        </p>
        <p>
          Slik går du frem:
          <ul>
            <li>Opprett en bruker på denne nettsiden</li>
            <li>Fra din brukerprofil, opprett en ny organisasjon</li>
          </ul>
        </p>
        <h3>Som frivillig</h3>
        <p>Frikanalen søker aktivt utviklere med kompetanse innen React, Next.JS, Python/Django, node.js.</p>
        <p>Ta kontakt med teknisk leder om du ønsker å bidra til at Frikanalen kan bli noe virkelig stort!</p>
      </WindowWidget>
    </>
  );
}
