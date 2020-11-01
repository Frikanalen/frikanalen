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

import ProfileFetcher from "../components/API/User";

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
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [MSISDN, setMSISDN] = useState(profile.phone_number);

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
      <Card variant="light" className="text-dark">
        <Card.Body>
          <Card.Title>Brukerprofil</Card.Title>
          <UserProfile profile={profile} onChange={onChange} />
        </Card.Body>
      </Card>
    </Col>
  );
}

function OrganizationCard({ role }) {
  const { org, isLoading, isError } = OrganizationFetcher(role.organization_id);

  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (isError) return <Spinner animation="border" variant="primary" />;

  const roleText = role.role == "editor" ? "Du er redaktør" : "Du er medlem";

  return (
    <Card body bg="light">
      <Card.Title className="mb-1">{org.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{roleText}</Card.Subtitle>
      <Card.Link href={`/org/${org.id}`}>Offentlig side</Card.Link>
    </Card>
  );
}

function OrganizationList({ profile }) {
  let organizationList;

  if (profile.organization_roles) {
    if (profile.organization_roles.length) {
      organizationList = profile.organization_roles.map((role, idx) => (
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

function OrganizationsCard({ profile }) {
  const { user, isLoading, isError } = profile;
  return (
    <Col>
      <Card variant="light" className="text-dark">
        <Card.Body>
          <Card.Title>Organisasjoner</Card.Title>
          <a href="/org/ny">Meld inn ny organisasjon</a>
          <Alert variant="info">
            <Alert.Heading>Vi jobber med saken!</Alert.Heading>
            Her vil det snart komme et skjema for å melde en organisasjon inn i Frikanalen.
          </Alert>
          <OrganizationList profile={profile} />
        </Card.Body>
      </Card>
    </Col>
  );
}

interface IProps {}
interface UserJSON {}
interface IState {
  profileData?: UserJSON;
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
      const profileData = await ProfileFetcher();
      this.setState({ profileData });
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
              <Alert variant="danger">
                «{profileError.message}» mens den kontaktet «{profileError.config.url}»
              </Alert>
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
          <h2>Hei, {this.state.profileData.first_name}!</h2>
          <UserCard profile={this.state.profileData} onChange={() => this.componentDidMount()} />
        </WindowWidget>
        <WindowWidget invisible>
          <OrganizationsCard profile={this.state.profileData} />
        </WindowWidget>
      </Layout>
    );
  }
}
