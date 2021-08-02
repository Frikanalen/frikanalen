import Link from "next/link";
import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { UserContext, UserContextState } from "./UserContext";

const UserDropdown = () => {
  const user = useContext<UserContextState>(UserContext);
  if (!user.isLoggedIn) return <Nav.Link href="/login">Logg inn/registrer</Nav.Link>;

  return (
    <>
      <NavDropdown id="" className="userdropdown justify-content-end" title={user.profile?.email}>
        <Link href="/profil" passHref>
          <NavDropdown.Item>Brukerside</NavDropdown.Item>
        </Link>
        <NavDropdown.Item onClick={user.logout}>Logg ut</NavDropdown.Item>
      </NavDropdown>
      <style jsx global>{`
        .userdropdown > a {
          color: #eee !important;
        }
      `}</style>
    </>
  );
};

export default function Header() {
  let devMessage = null;

  if (process.env.NEXT_PUBLIC_ENV === "development") devMessage = <span>development</span>;

  return (
    <header>
      <Navbar bg="light">
        <Navbar.Brand href="/">
          <img className="logo" src="/images/frikanalen.png" alt="Frikanalen" />
          {devMessage}
        </Navbar.Brand>
      </Navbar>
      <Navbar bg="dark" variant="dark">
        <Nav className="me-auto">
          <Link href="/" passHref>
            <Nav.Link>Direkte</Nav.Link>
          </Link>
          <Link href="/schedule" passHref>
            <Nav.Link>Sendeplan</Nav.Link>
          </Link>
          <NavDropdown id="" title="Om">
            <Link href="/om" passHref>
              <NavDropdown.Item>Om oss</NavDropdown.Item>
            </Link>
            <Link href="/om/blimed" passHref>
              <NavDropdown.Item>Bli med!</NavDropdown.Item>
            </Link>
            <Link href="/om/vedtekter" passHref>
              <NavDropdown.Item>Vedtekter</NavDropdown.Item>
            </Link>
            <Link href="/om/kontakt" passHref>
              <NavDropdown.Item>Kontakt oss</NavDropdown.Item>
            </Link>
          </NavDropdown>
        </Nav>
        <Nav>
          <UserDropdown />
        </Nav>
      </Navbar>
    </header>
  );
}
