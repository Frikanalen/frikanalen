import { Meta } from "modules/core/components/Meta";
import { Document } from "modules/ui/components/Document";
import { ExternalLink } from "modules/ui/components/ExternalLink";
import { Quote } from "modules/ui/components/Quote";

export default function About() {
  return (
    <Document>
      <Meta
        meta={{
          title: "Om",
          description: "Informasjon om Frikanalen og hvordan du kan bli medlem",
        }}
      />
      <h1>Frikanalen er sivilsamfunnets videoplatform</h1>
      <Quote
        citation={{
          name: "Frikanalens formålsparagraf",
          href: "/about/statutes",
        }}
      >
        Målet med Frikanalen er å styrke ytringsfrihet og deltakerdemokratiet ved å gi flere mulighet til å ytre seg i
        TV-mediet
      </Quote>
      <p>
        Vi ønsker i samarbeid med våre medlemsorganisasjoner utvikle en videoplattform uten forhåndssensur, tilrettelagt
        for behovene til norsk demokrati, organisasjonsliv og frivillighet.
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
      <ExternalLink href="/about/statutes">Våre vedtekter kan leses her</ExternalLink>
      <h2>Lyst til å bli med?</h2>
      <h3>Som medlem</h3>
      <p>
        Alle individer og ikke-kommersielle organisasjoner kan tegne medlemskap i Frikanalen og få sitt innhold sendt på
        riksdekkende fjernsyn.
      </p>
      <p>
        Slik går du frem:
        <ul>
          <li>
            Opprett en bruker på denne nettsiden, ved å trykke på «Logg inn» oppe til høyre, og så «Registrer ny konto?»
          </li>
          <li>Fra din brukerprofil, opprett en ny organisasjon</li>
          <li>For informasjon om kontingent og innmelding, se «Kontakt oss» lenger nede på denne siden</li>
        </ul>
      </p>
      <h3>Som frivillig</h3>
      <p>Frikanalen søker aktivt utviklere med kompetanse innen React, Next.JS, Python/Django, node.js.</p>
      <p>Ta kontakt med teknisk leder om du ønsker å bidra til at Frikanalen kan bli noe virkelig stort!</p>
      <h2>Kontakt oss</h2>
      <p>
        Leder Ola Tellesbø kan nås på <ExternalLink href="mailto:post@frikanalen.no">post@frikanalen.no</ExternalLink>
      </p>
      <p>
        Teknisk leder Tore Sinding Bekkedal kan nås på{" "}
        <ExternalLink href="mailto:toresbe@protonmail.com">toresbe@protonmail.com</ExternalLink>
      </p>
    </Document>
  );
}
