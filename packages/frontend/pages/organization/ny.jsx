import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../components/UserContext";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import configs from "../../components/configs";

import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

function NewOrgForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgBrregID, setOrgBrregID] = useState("");
  const [orgPostAdresse, setOrgPostAdresse] = useState("");
  const [orgBesoksAdresse, setOrgBesoksAdresse] = useState("");
  const [orgURL, setOrgURL] = useState("");
  const { token } = useContext(UserContext);

  const createOrganization = async (e) => {
    e.preventDefault();
    localStorage.removeItem("userData");
    try {
      const foo = await fetch(`${configs.api}organization/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orgName,
          orgnr: orgBrregID,
          postal_adress: orgPostAdresse,
          homepage: orgURL,
        }),
      });
      const data = await foo.json();
      router.push("/organization/[id]/admin", `/organization/${data.id}/admin`);
    } catch (exception) {
      // TODO: Handle this exception
      // console.log(exception);
    }
  };

  useEffect(() => {
    const formatAddress = (address) => {
      let retVal = "";
      retVal += address.adresse.join("\n");
      retVal += "\n";
      retVal += `${address.postnummer} ${address.poststed}`;
      return retVal;
    };

    const titleCase = (str) => {
      const splitStr = str.toLowerCase().split(" ");

      const exceptions = ["i", "og", "for", "mot", "ved", "av"];

      for (let i = 0; i < splitStr.length; i += 1) {
        if (exceptions.indexOf(splitStr[i]) === -1) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1);
        }
      }

      return splitStr.join(" ");
    };

    const fetchBrreg = async () => {
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgBrregID}`);
      const data = await res.json();
      return data;
    };

    if (orgBrregID.length === 9 && !Number.isNaN(parseInt(orgBrregID, 10))) {
      fetchBrreg(orgBrregID).then((org) => {
        setOrgName(titleCase(org.navn));
        setOrgPostAdresse(`${titleCase(org.navn)}\n${formatAddress(org.forretningsadresse)}`);
      });
    }
  }, [orgBrregID]);

  return (
    <Card body bg="bright" className="text-dark">
      <Form>
        <Form.Group>
          <Form.Label>Organisasjonsnummer</Form.Label>
          <Form.Control onChange={(e) => setOrgBrregID(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Organisasjonsnavn</Form.Label>
          <Form.Control value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Hjemmeside</Form.Label>
          <Form.Control onChange={(e) => setOrgURL(e.target.value)} />
        </Form.Group>
        <Form.Row>
          <Col>
            <Form.Label>Postadresse</Form.Label>
            <Form.Control
              as="textarea"
              rows="7"
              value={orgPostAdresse}
              onChange={(e) => setOrgPostAdresse(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>Besøksadresse</Form.Label>
            <Form.Control
              as="textarea"
              rows="7"
              value={orgBesoksAdresse}
              onChange={(e) => setOrgBesoksAdresse(e.target.value)}
            />
          </Col>
        </Form.Row>
        <br />
        <Form.Row>
          <Col className="text-right">
            <Button onClick={createOrganization} variant="primary" type="submit">
              Opprett
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </Card>
  );
}

export default function RegisterOrganization() {
  return (
    <Layout>
      <WindowWidget>
        <h2>Opprett medlemskap</h2>
        <p>Her kan du opprette en ny organisasjon i vår database.</p>
        <p>
          Du vil umiddelbart kunne laste opp innhold, men for at organisasjonens innhold skal være synlig for andre
          eller sendes på sendeplanen, må betalt kontingent være registrert, og en redaktørerklæring være mottatt.
        </p>
        <p>
          Privatpersoner kan også melde seg inn i Frikanalen og sende innhold som en organisasjon, men de vil likevel
          måtte inkludere besøks- og postadresse i henhold til{" "}
          <a href="https://lovdata.no/lov/1992-12-04-127/§2-16">Kringkastingsloven §2-16</a>, og vil ikke ha
          medlemsrettigheter i Frikanalen, som blant annet stemmerett.
        </p>{" "}
        <p>
          En mal for redaktørerklæring vil være tilgjengelig for nedlasting på organisasjonens side. Utelat i så fall
          organisasjonsnummer, sett organisasjonsnavn til ditt fulle navn.
        </p>
        <Alert variant="success">
          Tips: Om du taster inn organisasjonsnummer vil skjemaet automatisk hente navn og postadresse fra Brønnøysund
        </Alert>
        <NewOrgForm onVideoCreated={(orgID) => {}} />
      </WindowWidget>
    </Layout>
  );
}
