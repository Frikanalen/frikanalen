import * as React from "react";
import { Component, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";

import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import WindowWidget from "../components/WindowWidget";
import UserAuth from "../components/UserAuth";

import configs from "../components/configs";

import { fkUser, getUserProfile } from "../components/TS-API/API";

import Layout from "../components/Layout";

const AuthenticatedFetcher = (url) =>
  axios
    .get(url, {
      headers: { Authorization: `Token ${Cookies.get("token")}` },
    })
    .then((res) => res.data);

function OrganizationFetcher(id) {
  const { data, error } = useSWR(`${configs.api}organization/${id}`, AuthenticatedFetcher);

  return {
    org: data,
    isLoading: !error && !data,
    isError: error,
  };
}

function UserProfile({ profile, onChange }) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [MSISDN, setMSISDN] = useState(profile.msisdn);

  const submitProfile = (e) => {
    e.preventDefault();
    fetch(`${configs.api}user`, {
      method: "put",
      headers: {
        Authorization: `Token ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        last_name: lastName,
        first_name: firstName,
        phone_number: MSISDN,
      }),
    });

    UserAuth.refreshLocalStorage();
    setTimeout(onChange, 2000);
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

function UserCard({ profile, onChange }) {
  return (
    <Col>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Brukerprofil</Card.Title>
          <UserProfile profile={profile} onChange={onChange} />
        </Card.Body>
      </Card>
    </Col>
  );
}

function OrganizationCard({ role }) {
  const { org, isLoading, isError } = OrganizationFetcher(role.orgID);

  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (isError) return <Spinner animation="border" variant="primary" />;

  const roleText = role.role == "editor" ? "Du er redaktør" : "Du er medlem";

  console.log(org);
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

type ProfileProps = { profile: fkUser };
function OrganizationList({ profile }: ProfileProps) {
  let organizationList;

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

function OrganizationsCard({ profile }: ProfileProps) {
  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>Organisasjoner</Card.Title>
          <Button href="/organization/ny">Meld inn ny organisasjon</Button>
          <p>&nbsp;</p>
          <Card body bg="light" className="text-dark">
            <OrganizationList profile={profile} />
          </Card>
        </Card.Body>
      </Card>
    </Col>
  );
}

interface IProps {}
interface IState {
  profileData: fkUser;
  profileError?: Error;
}
export default class Profile extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      profileData: null,
      profileError: null,
    };
  }

  async componentDidMount() {
    try {
      this.setState({ profileData: await getUserProfile() });
    } catch (e) {
      this.setState({ profileError: e });
    }
  }

  render() {
    const { profileData, profileError } = this.state;
    if (!profileData) {
      if (profileError) {
        return (
          <Layout>
            <WindowWidget invisible>
              <Alert variant="danger">Feil: «{profileError.message}»</Alert>
            </WindowWidget>
          </Layout>
        );
      }
      return (
        <Layout>
          <WindowWidget invisible>
            <div>Laster inn...</div>
          </WindowWidget>
        </Layout>
      );
    }
    return (
      <Layout>
        <WindowWidget invisible>
          <h2>Hei, {profileData.firstName}!</h2>
          <UserCard profile={profileData} onChange={() => this.componentDidMount()} />
        </WindowWidget>
        <WindowWidget invisible>
          <OrganizationsCard profile={profileData} />
        </WindowWidget>
      </Layout>
    );
  }
}
