import {Metadata} from "next";
import Link from "next/link";
import {Card, CardBody} from "@heroui/card";

export const metadata: Metadata = {
    title: "Om Frikanalen",
    description: "Informasjon om Frikanalen og hvordan du kan bli medlem",
}

const Heading = ({children}: { children: React.ReactNode }) => (
    <h1 className="py-3 text-2xl font-bold">
        {children}
    </h1>
);

const Subheading = ({children}: { children: React.ReactNode }) => (
    <h2 className="py-3 text-xl font-bold">
        {children}
    </h2>
);

const Subsubheading = ({children}: { children: React.ReactNode }) => (
    <h3 className="py-3 text-lg font-bold">
        {children}
    </h3>
);

const Paragraph = ({children}: { children: React.ReactNode }) => (
    <p className="py-2">
        {children}
    </p>
);

export default function About() {
    return (
        <div className="prose-lg prose">
            <Heading>Frikanalen er sivilsamfunnets videoplatform</Heading>
            <Card>
                <CardBody>
                    Målet med Frikanalen er å styrke ytringsfrihet og deltakerdemokratiet ved å gi flere mulighet til å
                    ytre seg i TV-mediet.
                </CardBody>
            </Card>
            <Paragraph>
                Vi ønsker i samarbeid med våre medlemsorganisasjoner utvikle en videoplattform uten forhåndssensur,
                tilrettelagt for behovene til norsk demokrati, organisasjonsliv og frivillighet.
            </Paragraph>
            <Paragraph>
                Vi tilbyr alle våre medlemmer adgang til en riksdekkende TV-kanal med formidlingsplikt - som vil si at
                alle kabelleverandører er forpliktet til å bære vår kanal, på samme måte som NRK.
            </Paragraph>
            <Paragraph>
                Etter et omfattende frivillig arbeid har vi vurdert vår kanal stabil nok til å ta kontakt med tilbydere.
                Vi er
                nå på RiksTV og Telenor (Te-We), og i forhandlinger med Telia.
            </Paragraph>
            <Paragraph>
                Det pågår også et arbeide med å tilrettelegge for brukerstyrte direktesendinger rett ut til vår TV-kanal.
                I tillegg til dette er vi i full gang med å utvikle en god løsning for spredning av video på nett. Så følg med!
            </Paragraph>
            <Link href="/about/statutes/page">Våre vedtekter kan leses her</Link>
            <Subheading>Lyst til å bli med?</Subheading>
            <Subsubheading>Som medlem</Subsubheading>
            <Paragraph>
                Alle individer og ikke-kommersielle organisasjoner kan tegne medlemskap i Frikanalen og få sitt innhold
                sendt på
                riksdekkende fjernsyn.
            </Paragraph>
            <Paragraph>
                Slik går du frem:
                <ul>
                    <li>
                        Opprett en bruker på denne nettsiden, ved å trykke på «Logg inn» oppe til høyre, og så
                        «Registrer ny konto?»
                    </li>
                    <li>Fra din brukerprofil, opprett en ny organisasjon</li>
                    <li>For informasjon om kontingent og innmelding, se «Kontakt oss» lenger nede på denne siden</li>
                </ul>
            </Paragraph>
            <Subsubheading>Som frivillig</Subsubheading>
            <Paragraph>Frikanalen søker aktivt utviklere med kompetanse innen React, Next.JS, Python/Django,
                node.js.</Paragraph>
            <Paragraph>Ta kontakt med teknisk leder om du ønsker å bidra til at Frikanalen kan bli noe virkelig
                stort!</Paragraph>
            <Subheading>Kontakt oss</Subheading>
            <Paragraph>
                Leder Ola Tellesbø kan nås på <Link href="mailto:post@frikanalen.no">post@frikanalen.no</Link>
            </Paragraph>
            <Paragraph>
                Teknisk leder Tore Sinding Bekkedal kan nås på{" "}
                <Link href="mailto:toresbe@protonmail.com">toresbe@protonmail.com</Link>
            </Paragraph>
        </div>
    );
}
