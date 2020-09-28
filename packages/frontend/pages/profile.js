import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";

import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Layout from "../components/Layout";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import WindowWidget from "../components/WindowWidget";
import UserAuth from "../components/UserAuth";
import React, { Component } from "react";
import { useState } from "react";
import configs from "../components/configs";

import ProfileFetcher from "../components/API/User";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const AuthenticatedFetcher = (url) =>
  axios
    .get(url, {
      headers: { Authorization: "Token " + Cookies.get("token") },
    })
    .then((res) => res.data);

function OrganizationFetcher(id) {
  const { data, error } = useSWR(
    configs.api + "organization/" + id,
    AuthenticatedFetcher
  );

  return {
    org: data,
    isLoading: !error && !data,
    isError: error,
  };
}

function UserProfile(props) {
  const user = props.profile;
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [MSISDN, setMSISDN] = useState(user.phone_number);

  const submitProfile = (e) => {
    e.preventDefault();
    const result = fetch(configs.api + "user", {
      method: "put",
      headers: {
        Authorization: "Token " + Cookies.get("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        last_name: lastName,
        first_name: firstName,
        phone_number: MSISDN,
      }),
    });

    UserAuth.refreshLocalStorage();
    setTimeout(props.onChange, 2000);
  };

  return (
    <Form onSubmit={submitProfile}>
      <Form.Row>
        <Col>
          <Form.Label>Epostadressse</Form.Label>
          <Form.Control value={user.email} readOnly />
        </Col>
        <Col>
          <Form.Label>Mobilnummer</Form.Label>
          <Form.Control
            onChange={(e) => setMSISDN(e.target.value)}
            value={MSISDN}
          />
        </Col>
      </Form.Row>
      <br />
      <Form.Row>
        <Col>
          <Form.Label>Fornavn</Form.Label>
          <Form.Control
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </Col>
        <Col>
          <Form.Label>Etternavn</Form.Label>
          <Form.Control
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
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

function UserCard(props) {
  return (
    <Col>
      <Card variant="light" className="text-dark">
        <Card.Body>
          <Card.Title>Brukerprofil</Card.Title>
          <UserProfile profile={props.profile} onChange={props.onChange} />
        </Card.Body>
      </Card>
    </Col>
  );
}

function OrganizationCard(props) {
  const { org, isLoading, isError } = OrganizationFetcher(
    props.role.organization_id
  );

  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (isError) return <Spinner animation="border" variant="primary" />;

  const roleText =
    props.role.role == "editor" ? "Du er redaktør" : "Du er medlem";

  return (
    <Card body bg="light">
      <Card.Title className="mb-1">{org.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{roleText}</Card.Subtitle>
      <Card.Link href={"/o/" + org.id}>Offentlig side</Card.Link>
    </Card>
  );
}

function OrganizationList(props) {
  const user = props.profile;
  var organizationList;

  if (user.organization_roles) {
    if (user.organization_roles.length) {
      organizationList = user.organization_roles.map((role, idx) => (
        <Col key={idx}>
          <OrganizationCard role={role} />
          <br />
        </Col>
      ));
    } else {
      organizationList = (
        <Col>Ingen organisasjoner tilknyttet denne brukeren.</Col>
      );
    }
  }
  return (
    <Container fluid>
      <Row xs={1}>{organizationList}</Row>
    </Container>
  );
}

function OrganizationsCard(props) {
  const { user, isLoading, isError } = props.profile;
  return (
    <Col>
      <Card variant="light" className="text-dark">
        <Card.Body>
          <Card.Title>Organisasjoner</Card.Title>
          <Alert variant="info">
            <Alert.Heading>Vi jobber med saken!</Alert.Heading>
            Her vil det snart komme et skjema for å melde en organisasjon inn i
            Frikanalen.
          </Alert>
          <OrganizationList profile={props.profile} />
        </Card.Body>
      </Card>
    </Col>
  );
}

export default class Profile extends Component {
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
      this.setState({ profileData: profileData });
    } catch (e) {
      console.log(e);
      this.setState({ profileError: e });
    }
  }

  render() {
    if (!this.state.profileData) {
      if (this.state.profileError) {
        console.log(this.state.profileError);
        return (
          <Layout>
            <WindowWidget invisible>
              <Alert variant="danger">
                "{this.state.profileError.message}" mens den kontaktet "
                {this.state.profileError.config.url}"
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
          <UserCard
            profile={this.state.profileData}
            onChange={() => this.componentDidMount()}
          />
        </WindowWidget>
        <WindowWidget invisible>
          <OrganizationsCard profile={this.state.profileData} />
        </WindowWidget>
      </Layout>
    );
  }
}
