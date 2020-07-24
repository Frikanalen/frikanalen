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
                    <Link href="/" passHref><Nav.Link>Direkte</Nav.Link></Link>
                    <Link href="/schedule" passHref><Nav.Link>Sendeplan</Nav.Link></Link>
		    <NavDropdown title="Om">
                    <Link href="/om" passHref><NavDropdown.Item>Om oss</NavDropdown.Item></Link>
                    <Link href="/om/vedtekter" passHref><NavDropdown.Item>Vedtekter</NavDropdown.Item></Link>
                    <Link href="/om/styret" passHref><NavDropdown.Item>Styret</NavDropdown.Item></Link>
                    <Link href="/om/kontakt" passHref><NavDropdown.Item>Kontakt oss</NavDropdown.Item></Link>
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
