import Card from 'react-bootstrap/Card'
import Link from 'next/link';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import UserAuth from './UserAuth'

class Header extends Component {
    render () {
        return (
            <header>
            <Navbar bg="light">
                <Navbar.Brand href="/">
                    <img className="logo" src="/images/frikanalen.png" alt="Frikanalen" />
                </Navbar.Brand>
            </Navbar>
            <Navbar bg="dark" variant="dark">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Direkte</Nav.Link>
                    <Nav.Link href="/schedule">Sendeplan</Nav.Link>
		    <NavDropdown title="Om">
                    <NavDropdown.Item href="/om">Om oss</NavDropdown.Item>
                    <NavDropdown.Item href="/om/vedtekter">Vedtekter</NavDropdown.Item>
                    <NavDropdown.Item href="/om/styret">Styret</NavDropdown.Item>
                    <NavDropdown.Item href="/om/kontakt">Kontakt oss</NavDropdown.Item>
		    </NavDropdown>
                </Nav>
                <Nav className="ml-auto">
                    <UserAuth />
                </Nav>
            </Navbar>
            </header>
        );
    }
}

export default Header;
