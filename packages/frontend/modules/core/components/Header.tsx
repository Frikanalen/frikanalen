import React from "react";
import styled from "@emotion/styled";
import { Logo } from "./Logo";
import { HeaderLink } from "./HeaderLink";
import { HeaderAuthBar } from "./HeaderAuthBar";
import { mainContentStyle } from "../styles/mainContentStyle";
import { CONTENT_WIDTH, CONTENT_WIDTH_PADDING } from "../constants";

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
  ${mainContentStyle}
`;

const Nav = styled.nav`
  margin-top: 32px;

  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;

  @media (max-width: ${CONTENT_WIDTH + CONTENT_WIDTH_PADDING}px) {
    justify-content: center;
  }
`;

const SizedLogo = styled(Logo)`
  width: 400px;

  @media (max-width: 800px) {
    width: 60vw;
    min-width: 250px;
    max-width: 400px;

    margin-bottom: 24px;
  }
`;

export function Header() {
  return (
    <Outer>
      <Container>
        <LogoContainer>
          <SizedLogo />
        </LogoContainer>
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
