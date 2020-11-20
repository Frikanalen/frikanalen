import Link from "next/link";
import { UserContext } from "./UserContext";
import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const UserMenu = () => {
  const user = useContext(UserContext);
  if (!user.isLoggedIn) {
    return <Nav.Link href="/login">Logg inn/registrer</Nav.Link>;
  } else {
    return (
      <div>
        <NavDropdown className="userdropdown" title={user.profile?.email}>
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
      </div>
    );
  }
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
        <Nav className="mr-auto">
          <Link href="/" passHref>
            <Nav.Link>Direkte</Nav.Link>
          </Link>
          <Link href="/schedule" passHref>
            <Nav.Link>Sendeplan</Nav.Link>
          </Link>
          <NavDropdown title="Om">
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
        <Nav className="ml-auto">
          <UserMenu />
        </Nav>
      </Navbar>
    </header>
  );
}
