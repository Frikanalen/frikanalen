import React, { Component, useEffect, useContext, useState } from "react";
import { APIGET, fkOrgJSON } from "components/TS-API/API";

import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import WindowWidget from "../components/WindowWidget";

import { UserContext } from "../components/UserContext";
import configs from "../components/configs";

import { fkUser, getUserProfile } from "../components/TS-API/API";

import Layout from "../components/Layout";

function UserProfile() {
  const { profile, token, refresh } = useContext(UserContext);
  const [firstName, setFirstName] = useState(profile?.firstName);
  const [lastName, setLastName] = useState(profile?.lastName);
  const [MSISDN, setMSISDN] = useState(profile?.msisdn);

  const submitProfile = (e) => {
    e.preventDefault();
    fetch(`${configs.api}user`, {
      method: "put",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        last_name: lastName,
        first_name: firstName,
        phone_number: MSISDN,
      }),
    });
    refresh();
  };

  return (
    <Form onSubmit={submitProfile}>
      <Form.Row>
        <Col>
          <Form.Label>Epostadressse</Form.Label>
          <Form.Control value={profile.email} readOnly />
        </Col>
        <Col>
          <Form.Label>Mobilnummer</Form.Label>
          <Form.Control onChange={(e) => setMSISDN(e.target.value)} value={MSISDN} />
        </Col>
      </Form.Row>
      <br />
      <Form.Row>
        <Col>
          <Form.Label>Fornavn</Form.Label>
          <Form.Control onChange={(e) => setFirstName(e.target.value)} value={firstName} />
        </Col>
        <Col>
          <Form.Label>Etternavn</Form.Label>
          <Form.Control onChange={(e) => setLastName(e.target.value)} value={lastName} />
        </Col>
      </Form.Row>
      <Row>
        <Col>
          <br />
          <Button className="float-right" type="submit">
            Oppdater
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

function UserCard() {
  return (
    <Col>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Brukerprofil</Card.Title>
          <UserProfile />
        </Card.Body>
      </Card>
    </Col>
  );
}

function OrganizationCard({ role }) {
  const { token } = useContext(UserContext);
  const [org, setOrg] = useState(null as fkOrgJSON);

  useEffect(() => {
    APIGET<fkOrgJSON>(`organization/${role.orgID}`, token).then((res) => setOrg(res));
  }, [role.orgID]);

  const roleText = role.role == "editor" ? "Du er redaktør" : "Du er medlem";

  if (!org) return null;
  return (
    <Card body bg="white">
      <Card.Title className="mb-1">{org.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{roleText}</Card.Subtitle>
      <Card.Link href={`/organization/${org.id}`}>Offentlig side</Card.Link>
      <Card.Link href={`/organization/${org.id}/admin`}>Administrasjonsside</Card.Link>
      <Card.Link href={`/organization/${org.id}/ny-video`}>Last opp ny video</Card.Link>
    </Card>
  );
}

function OrganizationList() {
  let organizationList;
  const { profile } = useContext(UserContext);

  if (profile.organizationRoles) {
    if (profile.organizationRoles.length) {
      organizationList = profile.organizationRoles.map((role, idx) => (
        <Col key={idx}>
          <OrganizationCard role={role} />
          <br />
        </Col>
      ));
    } else {
      organizationList = <Col>Ingen organisasjoner tilknyttet denne brukeren.</Col>;
    }
  }
  return (
    <Container fluid>
      <Row xs={1}>{organizationList}</Row>
    </Container>
  );
}

function OrganizationsCard() {
  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>Organisasjoner</Card.Title>
          <Button href="/organization/ny">Meld inn ny organisasjon</Button>
          <p>&nbsp;</p>
          <Card body bg="light" className="text-dark">
            <OrganizationList />
          </Card>
        </Card.Body>
      </Card>
    </Col>
  );
}

function StaffMenu() {
  return (
    <WindowWidget invisible>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>Administratormeny</Card.Title>
            <Button href="/playout">Styring</Button>
          </Card.Body>
        </Card>
      </Col>
    </WindowWidget>
  );
}

export default function Profile() {
  const { profile } = useContext(UserContext);

  if (profile == null)
    return (
      <Layout>
        <p>Du må være logget inn</p>
      </Layout>
    );

  return (
    <Layout>
      <WindowWidget invisible>
        <h2>Hei, {profile.firstName}!</h2>
        <UserCard />
      </WindowWidget>
      {profile.isStaff ? <StaffMenu /> : null}
      <WindowWidget invisible>
        <OrganizationsCard />
      </WindowWidget>
    </Layout>
  );
}
