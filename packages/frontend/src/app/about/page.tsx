import { Metadata } from "next";
import { AccordionLinkGroup } from "@/app/about/statutes/accordionLinkGroup";
import { AccordionLink } from "@/app/about/statutes/accordionLink";
import React from "react";
import { PageLayout } from "@/app/about/pageLayout";

export const metadata: Metadata = {
  title: "Om",
  description: "Informasjon om Frikanalen og hvordan du kan bli medlem",
};

export default function About() {
  return (
    <PageLayout className="space-y-10">
      <h1 className={"text-4xl font-black"}>
        Frikanalen er
        <br /> sivilsamfunnets videoplatform.
      </h1>
      <div className="prose dark:prose-invert prose-lg">
        <p>
          Vi ønsker i samarbeid med våre medlemsorganisasjoner utvikle en
          videoplattform uten forhåndssensur, tilrettelagt for behovene til
          norsk demokrati, organisasjonsliv og frivillighet.
        </p>
        <p>
          Vi tilbyr alle våre medlemmer adgang til en riksdekkende TV-kanal med
          formidlingsplikt. Formidlingsplikt medfører at alle kabelleverandører
          er forpliktet til å bære vår kanal.
        </p>
      </div>
      <AccordionLinkGroup>
        <AccordionLink href="/about/statutes">Våre vedtekter</AccordionLink>
        <AccordionLink href="https://google.com">Vårt styre</AccordionLink>
        <AccordionLink href="https://google.com">
          Teknisk arbeidsgruppe
        </AccordionLink>
        <AccordionLink href="https://google.com">Bli med</AccordionLink>
      </AccordionLinkGroup>
    </PageLayout>
  );
}
