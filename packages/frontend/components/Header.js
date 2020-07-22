import Link from 'next/link';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'

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
                <Nav>
                    <Nav.Link href="/">Direkte</Nav.Link>
		    <NavDropdown title="Om">
                    <NavDropdown.Item href="/om">Om oss</NavDropdown.Item>
                    <NavDropdown.Item href="/om/vedtekter">Vedtekter</NavDropdown.Item>
                    <NavDropdown.Item href="/om/styret">Styret</NavDropdown.Item>
                    <NavDropdown.Item href="/om/kontakt">Kontakt oss</NavDropdown.Item>
		    </NavDropdown>
                </Nav>
            </Navbar>
            </header>
        );
    }
}

export default Header;
