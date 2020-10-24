import Container from "react-bootstrap/Container";
import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

export default function KontaktOss() {
  return (
    <Layout>
      <WindowWidget>
        <h2>Kontakt oss</h2>
        <p>
          Leder Ola Tellesbø kan nås på <a href="mailto:post@frikanalen.no">post@frikanalen.no</a>
        </p>
        <p>
          Teknisk leder Tore Sinding Bekkedal kan nås på <a href="mailto:toresbe@gmail.com">toresbe@gmail.com</a>
        </p>
      </WindowWidget>
    </Layout>
  );
}
