import React from "react";
import { HeaderLink } from "./HeaderLink";

export function NavLinks() {
  return (
    <>
      <HeaderLink accent="secondAccent" to="/" label="Direkte" />
      <HeaderLink accent="accent" to="/schedule" label="Sendeplan" />
      <HeaderLink accent="thirdAccent" to="/about" label="Om oss" />
    </>
  );
}
