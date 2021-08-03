import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import WindowWidget from "../components/WindowWidget";
import Layout from "../components/Layout";
import configs from "../components/configs";
import Link from "next/link";

export default function Signupform(): JSX.Element {
    const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // FIXME: Rewrite for fetch and zod
    async function signup(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        try {
            await axios.post(`${configs.api}user/register`, {
                email,
                password,
                firstName: givenName,
                lastName: familyName,
                dateOfBirth: "2020-07-24",
            });
        } catch (requestException) {
            if (axios.isAxiosError(requestException)) {
                setErrorMessage(<p>Noe gikk galt. Vennligst sjekk at du har gjort ting riktig.</p>)
                // const returnedErrors = Object.keys(requestException?.response?.data);
                /*
                interface Dictionary<T> {
                    [Key: string]: T;
                }


                const fieldNames: Dictionary<string> = {
                    firstName: "Fornavn",
                    lastName: "Etternavn",
                    password: "Passord",
                    email: "E-post",
                };

                setErrorMessage(
                    <Alert variant="warning">
                        <Alert.Heading>Beklager, det oppstod en feil!</Alert.Heading>
                        <code>{requestException.message}</code>
                    </Alert>
                );
                                 */

            }
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
                                    </Col>
                                    <Col>
                                        <Form.Label>Etternavn</Form.Label>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Control
                                            autoComplete="given-name"
                                            onChange={(e): void => setGivenName(e.target.value)}
                                            placeholder="Fornavn"
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            autoComplete="family-name"
                                            onChange={(e): void => setFamilyName(e.target.value)}
                                            placeholder="Etternavn"
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Epost-addresse (brukernavn)</Form.Label>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Control
                                            type="email"
                                            onChange={(e): void => setEmail(e.target.value)}
                                            autoComplete="username"
                                            placeholder="Oppgi epostadresse"
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Passord</Form.Label>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col>
                                        <Form.Control
                                            type="password"
                                            onChange={(e): void => setPassword(e.target.value)}
                                            autoComplete="new-password"
                                            placeholder="Passord"
                                        />
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
