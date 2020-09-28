import Layout from "../components/Layout";
import LiveNow from "../components/LiveNow";
import WindowWidget from "../components/WindowWidget";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

const BetaDisclaimer = () => (
  <WindowWidget nomargin>
    <Container fluid className="betaBisclaimer">
      <Row className="iconRow">
        <Col md="auto" className="iconBox">
          <svg
            id="betaDisclaimerIcon"
            xmlns="http://www.w3.org/2000/svg"
            height="73"
            viewBox="2 2 22 22"
            preserveAspectRatio="xMaxYMax meet"
            width="73"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </Col>
        <Col className="betaText">
          <h4>Velkommen til nye frikanalen.no!</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Etter mye hardt arbeide bak scenene kan vi endelig presentere første
            versjon av nye frikanalen.no!
          </p>
          <p>
            Snart vil det komme en nyhetsseksjon så dere vil kunne få et
            innblikk i alt arbeidet som er gjort.
          </p>
          <p>
            I mellomtiden vil du kunne få et lite innblikk i endringene ved å se
            på{" "}
            <a href="https://github.com/Frikanalen/frikanalen/commits/master">
              endringsloggen i kodearkivet
            </a>
            .
          </p>
        </Col>
      </Row>
      <style jsx global>{`
        .iconBox {
          margin-top: 10px;
        }
        .iconRow {
          place-items: center stretch;
        }
        @media (max-width: 767.98px) {
          .betaText h4 {
            margin-top: 2px;
          }
          #betaDisclaimerIcon {
            margin-top: 11px;
          }
        }
        #betaDisclaimerIcon {
          margin-top: 0px;
          fill: yellow;
        }
      `}</style>
    </Container>
  </WindowWidget>
);
export default function index() {
  return (
    <Layout>
      <Container>
        <Row sm={1} xl={2}>
          <Col>
            <LiveNow />
          </Col>
          <Col>
            <BetaDisclaimer />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
