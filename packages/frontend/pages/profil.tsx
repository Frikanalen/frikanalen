import React, { useEffect, useContext, useState } from "react";
import { APIGET, fkOrg, fkOrgRole, fkOrgSchema } from "components/TS-API/API";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import WindowWidget from "../components/WindowWidget";

import {UserContext, UserContextLoggedInState} from "../components/UserContext";
import configs from "../components/configs";

import Layout from "../components/Layout";

function UserProfile(): JSX.Element {
  const context = useContext(UserContext);

  const { profile, token, refresh } = context as UserContextLoggedInState;

  const [firstName, setFirstName] = useState(profile?.firstName);
  const [lastName, setLastName] = useState(profile?.lastName);
  const [MSISDN, setMSISDN] = useState(profile?.phoneNumber);

  if (!context.isLoggedIn) {
    return <></>;
  }

  if (!profile) {
    return <p>Kan ikke fortsette; brukerprofil udefinert.</p>;
  }
  const submitProfile = async (e: { preventDefault: () => void }): Promise<void> => {
    e.preventDefault();

    await fetch(`${configs.api}user`, {
      method: "put",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName,
        firstName,
        phoneNumber: MSISDN,
      }),
    });
    if (token) refresh(token);
  };

  return (
    <Form onSubmit={submitProfile}>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Fornavn</Form.Label>
          <Form.Control onChange={(e): void => setFirstName(e.target.value)} value={firstName} />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Etternavn</Form.Label>
          <Form.Control onChange={(e): void => setLastName(e.target.value)} value={lastName} />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Mobilnummer</Form.Label>
          <Form.Control onChange={(e): void => setMSISDN(e.target.value)} value={MSISDN} />
        </Form.Group>
        <Col>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3">
          <Button type="submit">
            Oppdater
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

function UserCard(): JSX.Element {
  const context = useContext(UserContext) as UserContextLoggedInState;

  return (
    <Col>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Brukerprofil for {context.profile.email}</Card.Title>
          <UserProfile />
        </Card.Body>
      </Card>
    </Col>
  );
}

function OrganizationCard({ role }: { role: fkOrgRole }): JSX.Element {
  const context = useContext(UserContext);

  const { token } = context as UserContextLoggedInState;
  const [org, setOrg] = useState<fkOrg>();

  useEffect(() => {
    if (role.organizationId) {
      APIGET<fkOrg>({
        endpoint: `organization/${role.organizationId}`,
        token: token,
        validator: fkOrgSchema.parse,
      }).then((res) => setOrg(res)).catch(e => console.log(e));
    }
  },[role.organizationId, token]);
  if (!context.isLoggedIn || !org) {
    return <></>;
  }

  const roleText = role.role == "editor" ? "Du er redaktør" : "Du er medlem";

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

function OrganizationList(): JSX.Element {
  let organizationList;
  const context = useContext(UserContext);
  if (!context.isLoggedIn) {
    return <></>;
  }

  const { profile } = context;

  if (profile && profile.organizationRoles) {
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

function OrganizationsCard(): JSX.Element {
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

function StaffMenu(): JSX.Element {
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

export default function Profile(): JSX.Element {
  const context = useContext(UserContext);
  if (!context.isLoggedIn) {
    return (
      <Layout>
        <p>Du må være logget inn</p>
      </Layout>
    );
  }

  const { profile } = context;

  if (profile == null) return <></>;

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
