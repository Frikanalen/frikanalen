import React from "react";
import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

export default function KontaktOss(): JSX.Element {
  return (
    <Layout>
      <WindowWidget>
        <h2>Kontakt oss</h2>
        <p>
          Leder Ola Tellesbø kan nås på <a href="mailto:post@frikanalen.no">post@frikanalen.no</a>
        </p>
        <p>
          Teknisk leder Tore Sinding Bekkedal kan nås på{" "}
          <a href="mailto:toresbe@protonmail.com">toresbe@protonmail.com</a>
        </p>
      </WindowWidget>
    </Layout>
  );
}
