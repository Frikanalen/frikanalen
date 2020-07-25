import Cookies from 'js-cookie'
import useSWR from 'swr'
import WindowWidget from '../components/WindowWidget'
import axios from 'axios'

import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Layout from '../components/Layout'
import Row from 'react-bootstrap/Row'
import UserAuth from '../components/UserAuth'
import React, { Component } from 'react';
import configs from '../components/configs'

const AuthenticatedFetcher = url => axios.get(url, {
    headers: { 'Authorization': 'Token ' + Cookies.get('token') }
    }).then(res => res.data)

function OrganizationFetcher(id) {
    const { data, error } = useSWR(configs.api + 'organization/' + id, AuthenticatedFetcher)

    return {
        org: data,
        isLoading: !error && !data,
        isError: error
    }
}

function ProfileFetcher() {
    const { data, error } = useSWR(configs.api + 'user', AuthenticatedFetcher)

    return {
        user: data,
        isLoading: !error && !data,
        isError: error
    }
}

function UserProfile (props) {
    const { user, isLoading, isError } = props.profile

    if(isLoading) return (<Spinner animation="border" variant="primary" />)
    if(isError) return (<Spinner animation="border" variant="primary" />)

    return (
        <p>{user.email}</p>
    );
}

function UserCard (props) {
    return (
        <Col>
        <Card variant="light" className="text-dark">
        <Card.Body>
        <Card.Title>Brukerprofil</Card.Title>
        <UserProfile profile={props.profile}/>
        </Card.Body>
        </Card>
        </Col>
    )
}

function OrganizationCard(props) {
    const { org, isLoading, isError } = OrganizationFetcher(props.role.organization_id)

    if(isLoading) return (<Spinner animation="border" variant="primary" />)
    if(isError) return (<Spinner animation="border" variant="primary" />)

    const roleText = props.role.role == 'editor' ? 'Du er redaktør' : 'Du er medlem'

    return (
        <Card body bg="light">
        <Card.Title className="mb-1">{org.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{roleText}</Card.Subtitle>
        <Card.Link href={"/o/" + org.id}>Offentlig side</Card.Link>
        </Card>
    )
}

function OrganizationList(props) {
    const { user, isLoading, isError } = props.profile

    if(isLoading) return (<Spinner animation="border" variant="primary" />)
    if(isError) return (<Spinner animation="border" variant="primary" />)

    const organizationList = user.organization_roles.map((role, idx) => 
        <Col key={idx}>
        <OrganizationCard role={role} />
        <br/>
        </Col>
    )

    return (
        <Container fluid>
        <Row xs={1} lg={2}>
        { organizationList }
        </Row>
        </Container>
    )
}

function OrganizationsCard (props) {
    const { user, isLoading, isError } = props.profile
    return (
        <Col>
        <Card variant="light" className="text-dark">
        <Card.Body>
        <Card.Title>Organisasjoner</Card.Title>
        <OrganizationList profile={props.profile} />
        </Card.Body>
        </Card>
        </Col>
    )
}

export default function Profile () {
    const profile = ProfileFetcher()
    return (
            <Layout>
            <WindowWidget invisible>
            <UserCard profile={profile} />
            </WindowWidget>
            <WindowWidget invisible>
            <OrganizationsCard profile={profile} />
            </WindowWidget>
            </Layout>
    );
}
