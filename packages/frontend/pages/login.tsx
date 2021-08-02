import React, { useState, useContext, FormEvent } from "react";
import Router from "next/router";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import WindowWidget from "../components/WindowWidget";
import Layout from "../components/Layout";

import {UserContext, UserContextState} from "../components/UserContext";
import { getUserToken } from "../components/TS-API/API";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const user: UserContextState = useContext(UserContext);

  async function authenticate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!user.isReady) throw new Error("Tried to login on uninitialized user context")
    if (user.login) user.login(await getUserToken(email, password));
    await Router.push("/profil");
  }

  // if there is a user ID set
  // verify that the user has a valid session.
  // if the session is valid, redirect to landing page.
  return (
    <Layout>
      <WindowWidget invisible>
        <Card border="primary" className="loginCard">
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
