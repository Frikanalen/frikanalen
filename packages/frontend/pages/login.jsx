import React, { useState, useContext } from "react";
import Router from "next/router";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import WindowWidget from "../components/WindowWidget";
import Layout from "../components/Layout";
import config from "../components/configs";
import base64 from "base-64";
import { UserContext } from "../components/UserContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const user = useContext(UserContext);

  async function authenticate(e) {
    e.preventDefault();
    const r = await fetch(`${config.api}obtain-token`, {
      headers: {
        Authorization: "Basic " + base64.encode(email + ":" + password),
      },
    });

    if (r.status == 200) {
      const data = await r.json();
      user.login(data.key);
      Router.push("/profil");
    } else {
      setErrorMessage(<Alert variant="danger">{authenticate}</Alert>);
    }
  }

  // if there is a user ID set
  // verify that the user has a valid session.
  // if the session is valid, redirect to landing page.
  return (
    <Layout>
      <WindowWidget invisible>
        <Card variant="primary" border="primary" className="loginCard">
          <Card.Body>
            <Card.Title>Logg inn</Card.Title>
            {errorMessage}
            <Form onSubmit={(event) => authenticate(event)}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Epostadresse</Form.Label>
                <Form.Control
                  type="email"
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Oppgi epostadresse"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Passord</Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passord"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Logg inn
              </Button>
              <span className="registration-invitation">
                ...eller <a href="/register">registrer ny bruker</a>
              </span>
              <style jsx global>
                {`
                  .registration-invitation {
                    padding-left: 10px;
                  }
                  .loginCard {
                    color: black;
                    width: 70%;
                    margin: 0 auto;
                    margin-top: 40px;
                  }
                `}
              </style>
            </Form>
          </Card.Body>
        </Card>
      </WindowWidget>
    </Layout>
  );
}
