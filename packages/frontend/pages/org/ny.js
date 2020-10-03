import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import configs from "../../components/configs";
import Cookies from "js-cookie";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

function NewOrgForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgBrregID, setOrgBrregID] = useState("");
  const [orgBrregName, setOrgBrregName] = useState("");
  const [orgPostAdresse, setOrgPostAdresse] = useState("");
  const [orgBesoksAdresse, setOrgBesoksAdresse] = useState("");
  const [orgURL, setOrgURL] = useState("");

  const createOrganization = async (e) => {
    e.preventDefault();
    try {
      const foo = await fetch(configs.api + "organization/", {
        method: "POST",
        headers: {
          Authorization: "Token " + Cookies.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orgName,
          orgnr: orgBrregID,
          postal_adress: orgPostAdresse,
          homepage: orgURL,
        }), //{ inputIndex: inputIndex }),
      });
      const data = await foo.json();
      router.push("/org/[id]", "/org/" + data.id);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const formatAddress = (address) => {
      var retVal = "";
      retVal += address.adresse.join("\n");
      retVal += "\n";
      retVal += address.postnummer + " " + address.poststed;
      console.log(address);
      return retVal;
    };

    const titleCase = (str) => {
      var splitStr = str.toLowerCase().split(" ");

      const exceptions = ["i", "og", "for", "mot", "ved", "av"];

      for (var i = 0; i < splitStr.length; i++) {
        if (exceptions.indexOf(splitStr[i]) == -1) {
          splitStr[i] =
            splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1);
        }
      }
      str = splitStr.join(" ");

      return str;
    };

    const fetchBrreg = async (orgID) => {
      const res = await fetch(
        "https://data.brreg.no/enhetsregisteret/api/enheter/" + orgBrregID
      );
      const data = await res.json();
      return data;
    };

    if (orgBrregID.length == 9 && !isNaN(parseInt(orgBrregID))) {
      fetchBrreg(orgBrregID).then((org) => {
        console.log(org);
        setOrgName(titleCase(org.navn));
        setOrgPostAdresse(
          titleCase(org.navn) + "\n" + formatAddress(org.forretningsadresse)
        );
      });
    }
  }, [orgBrregID]);

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Organisasjonsnummer</Form.Label>
          <Form.Control onChange={(e) => setOrgBrregID(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Organisasjonsnavn</Form.Label>
          <Form.Control
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
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
              value={orgPostAdresse}
              onChange={(e) => setOrgBesoksAdresse(e.target.value)}
            />
          </Col>
        </Form.Row>
        <br />
        <Form.Row>
          <Col className="text-right">
            <Button
              onClick={createOrganization}
              variant="primary"
              type="submit"
            >
              Opprett
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}

export default function RegisterOrganization() {
  return (
    <Layout>
      <WindowWidget>
        <h2>Opprett medlemskap</h2>
        <p>Her kan du opprette en ny organisasjon i vår database.</p>
        <p>
          Du vil umiddelbart kunne laste opp innhold, men for at organisasjonens
          innhold skal være synlig for andre eller sendes på sendeplanen, må
          betalt kontingent være registrert, og en redaktørerklæring være
          mottatt.
        </p>
        <p>
          En mal for redaktørerklæring vil være tilgjengelig for nedlasting på
          organisasjonens side.
        </p>
        <Alert variant="success">
          Tips: Om du taster inn organisasjonsnummer vil skjemaet automatisk
          hente navn og postadresse fra Brønnøysund
        </Alert>
        <NewOrgForm onVideoCreated={(orgID) => {}} />
      </WindowWidget>
    </Layout>
  );
}
