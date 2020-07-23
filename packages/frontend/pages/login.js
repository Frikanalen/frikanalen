import React, { useState } from 'react';
import Router from 'next/router'

import Card from 'react-bootstrap/Card'
import Layout from '../components/Layout'
import UserAuth from '../components/UserAuth'
import WindowWidget from '../components/WindowWidget'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function login(e) {
        e.preventDefault();
        var login = await UserAuth.login(email, password)
        if (login === true) {
            await UserAuth.profile_data()
            Router.push('/')
        } else {
            setErrorMessage(<Alert variant="danger">{login}</Alert>)
        }
    }

    // if there is a user ID set
    // verify that the user has a valid session.
    // if the session is valid, redirect to landing page.
    return (
        <Layout>
        <Card variant="primary" border="primary" className="loginCard">
        <Card.Body>
        <Card.Title>Logg inn</Card.Title>
        {errorMessage}
        <Form onSubmit={(event) => login(event)} >
        <Form.Group controlId="formBasicEmail">
        <Form.Label>Epostadresse</Form.Label>
        <Form.Control type="email" autoComplete="username" onChange={(e) => setEmail(e.target.value)} placeholder="Oppgi epostadresse" />
        </Form.Group> 
        <Form.Group controlId="formBasicPassword">
        <Form.Label>Passord</Form.Label>
        <Form.Control type="password" autoComplete="current-password" 
            onChange={(e) => setPassword(e.target.value)} placeholder="Passord" />
        </Form.Group>
        <Button variant="primary" type="submit">Logg inn</Button>
        <span className="registration-invitation">...eller <a href="/register">registrer ny bruker</a></span>
        <style jsx global>{`
            .registration-invitation {
                padding-left: 10px;
            }
            .loginCard {
                color: black;
                width: 70%;
                margin: 0 auto;
                margin-top: 40px;
            }
            `}</style>
        </Form>
        </Card.Body>
        </Card>
        </Layout>
    )
}
