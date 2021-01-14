import React, { useEffect, useContext, useState } from "react";
import { APIGET, fkOrg, fkOrgRole, fkOrgSchema } from "components/TS-API/API";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import WindowWidget from "../components/WindowWidget";

import { UserContext } from "../components/UserContext";
import configs from "../components/configs";

import Layout from "../components/Layout";

function UserProfile() {
  const context = useContext(UserContext);
  if (!context.isLoggedIn) {
    return <></>;
  }

  const { profile, token, refresh } = context;
  const [firstName, setFirstName] = useState(profile?.firstName);
  const [lastName, setLastName] = useState(profile?.lastName);
  const [MSISDN, setMSISDN] = useState(profile?.phoneNumber);

  const submitProfile = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    await fetch(`${configs.api}user`, {
      method: "put",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName: lastName,
        firstName: firstName,
        phoneNumber: MSISDN,
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

function OrganizationCard({ role }: { role: fkOrgRole }) {
  const context = useContext(UserContext);
  if (!context.isLoggedIn) {
    return <></>;
  }

  const { token } = context;
  const [org, setOrg] = useState<fkOrg>();

  useEffect(() => {
    if (role.organizationId) {
      APIGET<fkOrg>({
        endpoint: `organization/${role.organizationId}`,
        token: token,
        validator: fkOrgSchema.parse,
      }).then((res) => setOrg(res));
    }
  }, [role.organizationId]);

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
  const context = useContext(UserContext);
  if (!context.isLoggedIn) {
    return <></>;
  }

  const { profile } = context;

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
  const context = useContext(UserContext);
  if (!context.isLoggedIn) {
    return (
      <Layout>
        <p>Du må være logget inn</p>
      </Layout>
    );
  }

  const { profile } = context;

  if (profile == null) return null;

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
