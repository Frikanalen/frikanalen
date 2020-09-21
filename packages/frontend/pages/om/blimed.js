import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

export default function Blimed() {
  return (
    <Layout>
      <WindowWidget>
        <h2>Bli med!</h2>
        <p>
          Alle ikke-kommersielle organisasjoner kan tegne medlemskap i
          Frikanalen og få sitt innhold sendt på riksdekkende fjernsyn.
        </p>
        <Alert variant="info">
          <h3>Du er litt for tidlig ute!</h3>
          <p>
            Denne nettsiden er under aktiv utvikling. Vi kommer med en utførlig
            guide her så fort vi kan.
          </p>
          <p>
            I mellomtiden henviser vi til «<a href="/om/kontakt">Kontakt oss</a>
            » for informasjon om kontingent og innmelding.
          </p>
        </Alert>
      </WindowWidget>
    </Layout>
  );
}
