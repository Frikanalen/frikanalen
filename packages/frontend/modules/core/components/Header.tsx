import React from "react";
import styled from "@emotion/styled";
import { Logo } from "./Logo";
import { CONTENT_WIDTH } from "../constants";
import { HeaderLink } from "./HeaderLink";
import { HeaderAuthBar } from "./HeaderAuthBar";

const Outer = styled.div`
  margin-top: 64px;

  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.header`
  width: ${CONTENT_WIDTH}px;
`;

const Nav = styled.nav`
  margin-top: 32px;

  display: flex;
  align-items: center;
`;

const SizedLogo = styled(Logo)`
  width: 400px;
`;

export function Header() {
  return (
    <Outer>
      <Container>
        <SizedLogo />
        <Nav>
          <HeaderLink accent="secondAccent" to="/" label="Direkte" />
          <HeaderLink accent="accent" to="/schedule" label="Sendeplan" />
          <HeaderLink accent="thirdAccent" to="/about" label="Om oss" />
          <HeaderAuthBar />
        </Nav>
      </Container>
    </Outer>
  );
}
