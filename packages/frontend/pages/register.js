import * as env from '../components/constants'

import React, { useState } from 'react';
import Card from 'react-bootstrap/Card'
import Layout from '../components/Layout';
import WindowWidget from '../components/WindowWidget'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'

export default function Signupform() {
    async function signup(e) {
        e.preventDefault()
        const result = await axios.post(env.API_BASE_URL + "user/register",
            {
                email: email,
                password: password,
                first_name: givenName,
                last_name: familyName,
                date_of_birth: '2020-07-24'
            }
        )
        console.log(result)
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    console.log()
    return (
        <Layout>
        <Card variant="primary" border="primary" className="loginCard">
        <Card.Body>
        <Card.Title>Registrer deg</Card.Title>
        {errorMessage}
        <Form onSubmit={(event) => signup(event)}>
        <Form.Row>
        <Col>
        <Form.Label>Fornavn</Form.Label>
        </Col>
        <Col>
        <Form.Label>Etternavn</Form.Label>
        </Col> </Form.Row> 
        <Form.Row>
        <Col>
        <Form.Control autoComplete="given-name"  onChange={(e) => setGivenName(e.target.value)} placeholder="Fornavn" />
        </Col> <Col>
        <Form.Control autoComplete="family-name" onChange={(e) => setFamilyName(e.target.value)} placeholder="Etternavn" />
        </Col> </Form.Row> <Form.Row> <Col>
        <Form.Label>Epost-addresse (brukernavn)</Form.Label>
        </Col> </Form.Row> <Form.Row> <Col>
        <Form.Control type="email" onChange={(e) => setEmail(e.target.value)}  autoComplete="username" placeholder="Oppgi epostadresse" />
        </Col> </Form.Row> <Form.Row> <Col>
        <Form.Label>Passord</Form.Label>
        </Col> </Form.Row> <Form.Row> <Col>
        <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} 
                autoComplete="new-password" placeholder="Passord" />
        </Col> </Form.Row> <Form.Row> <Col>
        <Button className="submit" variant="primary" type="submit" primary="yes">
        Submit
        </Button>
        </Col>
        <style jsx global>{`
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
            `}</style>
        </Form.Row>
        </Form>
        </Card.Body>
        </Card>
        </Layout>
    );
}
