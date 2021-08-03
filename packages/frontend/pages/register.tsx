import React, {useContext, useState} from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import WindowWidget from "../components/WindowWidget";
import Layout from "../components/Layout";
import configs from "../components/configs";
import Link from "next/link";
import {z} from 'zod';
import {ErrorsIfAny} from "../components/TS-API/formUtils";
import {FetchError} from "node-fetch";
import {getUserToken} from "../components/TS-API/API";
import {UserContext} from "../components/UserContext";

const userSignupForm = z.object({
    givenName: z.string().nonempty({message: "Du må oppgi et fornavn"}),
    familyName: z.string().nonempty({message: "Du må oppgi et etternavn"}),
    email: z.string().email({message: "Ugyldig e-postadresse"}),
    password: z.string()
        .min(6, {message: "Passord må være minst 6 tegn"})
        .max(64, {message: "Imponerende, men ditt passord må være maksimalt 64 tegn"}),
})

export default function Signupform(): JSX.Element {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string[]; }>();
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signup(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        try {
            userSignupForm.parse({givenName, familyName, email, password})
        } catch (validationException) {
            if (validationException instanceof z.ZodError) {
                setFieldErrors(validationException.flatten().fieldErrors)
                return
            }
        }

            const headers: Headers = new Headers();
            headers.set("Content-Type", "application/json");
            try {
                const res = await fetch(`${configs.api}user/register`,
                    {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            email,
                            password,
                            firstName: givenName,
                            lastName: familyName,
                            dateOfBirth: "2020-07-24",
                        })
                    });
                if (!res.ok) {
                    throw new FetchError(await res.text(), res.statusText)
                }
            } catch (fe) {
                if(fe instanceof Error)
                    setErrorMessage(<p>Feil fra server: {fe.message}</p>)
            }
            try {
                const token = await getUserToken(email, password)
                if (userContext?.login) userContext.login(token)
            } catch (e) {
                if(e instanceof Error)
                    setErrorMessage(<p>Feil fra server: {e.message}</p>)
            }
    }

    return (
        <Layout>
            <WindowWidget invisible>
                <Card border="primary" className="loginCard">
                    <Card.Body>
                        <Card.Title>Registrer deg</Card.Title>
                        <Card.Text>
                            <Alert variant="info">
                                <p>For å laste opp innhold må individet eller organisasjonen formelt innmeldes i
                                    Frikanalen.</p>
                                <p>
                                    For mer om medlemskap, se: «<Link passHref href="/om/blimed"><a>Bli med!</a></Link>»
                                </p>
                                <p>
                                    Her kan du opprette en bruker for tilgang til innmeldingsskjema og andre
                                    medlemsfunksjoner på siden.
                                </p>
                            </Alert>
                            <Form onSubmit={(event): Promise<void> => signup(event)}>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Fornavn</Form.Label>
                                        <Form.Control
                                            autoComplete="given-name"
                                            onChange={(e): void => setGivenName(e.target.value)}
                                            placeholder="Fornavn"
                                            isInvalid={!!fieldErrors?.givenName}
                                        />
                                        <ErrorsIfAny error={fieldErrors?.givenName}/>
                                    </Col>

                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Etternavn</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            autoComplete="family-name"
                                            onChange={(e): void => setFamilyName(e.target.value)}
                                            placeholder="Etternavn"
                                            isInvalid={!!fieldErrors?.familyName}
                                        />
                                        <ErrorsIfAny error={fieldErrors?.familyName}/>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Epost-addresse (brukernavn)</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="email"
                                            onChange={(e): void => setEmail(e.target.value)}
                                            autoComplete="username"
                                            isInvalid={!!fieldErrors?.email}
                                            placeholder="Oppgi epostadresse"
                                        />
                                        <ErrorsIfAny error={fieldErrors?.email}/>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Passord</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="password"
                                            onChange={(e): void => setPassword(e.target.value)}
                                            autoComplete="new-password"
                                            isInvalid={!!fieldErrors?.password}
                                            placeholder="Passord"
                                        />
                                        <ErrorsIfAny error={fieldErrors?.password}/>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Alert type="warning">{errorMessage}</Alert>
                                        <Button className="submit" variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Col>
                                    <style jsx global>
                                        {`
                      .form-row {
                        margin: 10px;
                      }
                      .submit {
                        margin-top: 10px;
                      }
                      .loginCard {
                        color: black;
                        width: 70%;
                        margin: 0 auto;
                        margin-top: 40px;
                      }
                    `}
                                    </style>
                                </Form.Row>
                            </Form>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </WindowWidget>
        </Layout>
    );
}
