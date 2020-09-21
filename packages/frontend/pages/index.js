import Layout from "../components/Layout";
import LiveNow from "../components/LiveNow";
import WindowWidget from "../components/WindowWidget";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

const BetaDisclaimer = () => (
  <WindowWidget nomargin>
    <Container fluid className="beta-disclaimer">
      <Row className="icon-row">
        <Col md="auto" className="icon-box">
          <svg
            id="beta-disclaimer-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="80"
            viewBox="0 0 24 24"
            preserveAspectRatio="xMaxYMax meet"
            width="100"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </Col>
        <Col className="beta-text">
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
        </Col>
      </Row>
      <style jsx global>{`
        .icon-row {
          place-items: center;
          padding: 5px;
        }

        #beta-disclaimer-icon {
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
