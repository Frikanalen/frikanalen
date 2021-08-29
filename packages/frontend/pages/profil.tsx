import React, { useEffect, useContext, useState } from "react";
import { APIGET, fkOrg, fkOrgRole, fkOrgSchema } from "components/TS-API/API";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import WindowWidget from "../components/WindowWidget";

import { UserContext, UserContextLoggedInState } from "../components/UserContext";
import configs from "../components/configs";
import { useStores } from "modules/state/manager";

function UserProfile(): JSX.Element {
  const { authStore } = useStores();
  const { user } = authStore;

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [MSISDN, setMSISDN] = useState(user?.phoneNumber);

  if (!user) {
    return <></>;
  }

  const submitProfile = async (e: { preventDefault: () => void }): Promise<void> => {
    e.preventDefault();

    await fetch(`${configs.api}user`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        lastName,
        firstName,
        phoneNumber: MSISDN,
      }),
    });
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
        <Col></Col>
      </Row>
      <Row>
        <Col className="mb-3">
          <Button type="submit">Oppdater</Button>
        </Col>
      </Row>
    </Form>
  );
}

function UserCard(): JSX.Element {
  const { authStore } = useStores();
  const { user } = authStore;

  return (
    <Col>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Brukerprofil for {user?.email}</Card.Title>
          <UserProfile />
        </Card.Body>
      </Card>
    </Col>
  );
}

function OrganizationCard({ role }: { role: fkOrgRole }): JSX.Element {
  const { authStore } = useStores();
  const { user } = authStore;

  const [org, setOrg] = useState<fkOrg>();

  useEffect(() => {
    if (role.organizationId) {
      APIGET<fkOrg>({
        endpoint: `organization/${role.organizationId}`,
        validator: fkOrgSchema.parse,
      })
        .then((res) => setOrg(res))
        .catch((e) => console.log(e));
    }
  }, [role.organizationId]);

  if (!user || !org) {
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

  const { authStore } = useStores();
  const { user } = authStore;

  if (!user) {
    return <></>;
  }

  if ((user as any).organizationRoles) {
    if ((user as any).organizationRoles.length) {
      organizationList = (user as any).organizationRoles.map((role: any, idx: any) => (
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
  const { authStore } = useStores();
  const { user } = authStore;

  if (!user) {
    return <p>Du må være logget inn</p>;
  }

  return (
    <>
      <WindowWidget invisible>
        <h2>Hei, {user.firstName}!</h2>
        <UserCard />
      </WindowWidget>
      {user.isStaff ? <StaffMenu /> : null}
      <WindowWidget invisible>
        <OrganizationsCard />
      </WindowWidget>
    </>
  );
}
