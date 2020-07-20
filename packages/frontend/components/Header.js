import Link from 'next/link';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

class Header extends Component {
    render () {
        return (
            <header>
            <Navbar bg="light">
                <Navbar.Brand href="#home">
                    <img className="logo" src="/images/frikanalen.png" alt="Frikanalen" />
                </Navbar.Brand>
            </Navbar>
            <Navbar bg="dark" variant="dark">
                <Nav>
                    <Nav.Link href="/">Direkte</Nav.Link>
                    <Nav.Link href="/om">Om oss</Nav.Link>
                </Nav>
            </Navbar>
            </header>
        );
    }
}

export default Header;
