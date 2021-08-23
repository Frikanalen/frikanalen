import React, { useState, useContext, FormEvent } from "react";
import Router from "next/router";
import Link from "next/link";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import WindowWidget from "../components/WindowWidget";

import { UserContext, UserContextState } from "../components/UserContext";
import { getUserToken } from "../components/TS-API/API";
import { z } from "zod";
import { ErrorsIfAny } from "../components/TS-API/formUtils";

const userLoginForm = z.object({
  email: z.string().email({ message: "Ugyldig e-postadresse" }),
  password: z
    .string()
    .min(6, { message: "Passord må være minst 6 tegn" })
    .max(64, { message: "Imponerende, men ditt passord må være maksimalt 64 tegn" }),
});

export default function LoginForm(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string[] }>();
  const user: UserContextState = useContext(UserContext);

  async function authenticate(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      userLoginForm.parse({ email, password });
    } catch (ze) {
      if (ze instanceof z.ZodError) setFieldErrors(ze.flatten().fieldErrors);
      return;
    }
    if (user.login) user.login(await getUserToken(email, password));
    await Router.push("/profil");
  }

  // if there is a user ID set
  // verify that the user has a valid session.
  // if the session is valid, redirect to landing page.
  return (
    <>
      <WindowWidget invisible>
        <Card border="primary" className="loginCard">
          <Card.Body>
            <Card.Title>Logg inn</Card.Title>
            <Form
              onSubmit={async (event): Promise<void> => {
                try {
                  await authenticate(event);
                } catch (e) {
                  if (e instanceof Error) setErrorMessage(e.message);
                }
              }}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Epostadresse</Form.Label>
                <Form.Control
                  type="email"
                  isInvalid={!!fieldErrors?.email}
                  autoComplete="username"
                  onChange={(e): void => setEmail(e.target.value)}
                  placeholder="Oppgi epostadresse"
                />
                <ErrorsIfAny error={fieldErrors?.email} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Passord</Form.Label>
                <Form.Control
                  type="password"
                  isInvalid={!!fieldErrors?.password}
                  autoComplete="current-password"
                  onChange={(e): void => setPassword(e.target.value)}
                  placeholder="Passord"
                />
                <ErrorsIfAny error={fieldErrors?.password} />
              </Form.Group>
              <h3>{errorMessage}</h3>
              <Button variant="primary" type="submit">
                Logg inn
              </Button>
              <span className="registration-invitation">
                ...eller{" "}
                <Link href="/register">
                  <a>registrer ny bruker</a>
                </Link>
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
    </>
  );
}
