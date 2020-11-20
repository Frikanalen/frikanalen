import React, { createRef, useState } from "react";
import { APIGET, fkScheduleJSON } from "components/TS-API/API";
import Moment from "react-moment";
import dynamic from "next/dynamic";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { findRunningProgram } from "../../components/ScheduleInfo";
import "moment/locale/nb";
import Trianglify from "components/graphics/background.js";

const AnalogClock = dynamic(() => import("components/graphics/analogclock.js"), { ssr: false });

export async function getServerSideProps(context) {
  const scheduleJSON = await APIGET<fkScheduleJSON>(`scheduleitems/?days=1`);

  return {
    props: {
      scheduleJSON,
    },
  };
}

function Carousel({ children }) {
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageDuration = parseInt(children[currentPage].props.duration);
  setTimeout(() => {
    if (1 + currentPage == children.length) {
      setCurrentPage(0);
      return;
    }
    setCurrentPage(currentPage + 1);
  }, currentPageDuration * 1000);

  return <div style={{ background: "#faa", width: "1280px", height: "720px" }}>{children[currentPage]}</div>;
}

function CarouselPage({ duration, children }) {
  return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
}

function NextUp(props) {
  const { scheduleJSON } = props;
  const currentProgramme = findRunningProgram(scheduleJSON.results) + 1;

  return (
    <CarouselPage duration="1000">
      <Container>
        <Row>
          <img src="/images/frikanalen.png" style={{ margin: "30px", marginLeft: "51px" }} />
        </Row>
        <Row>
          <Col style={{ flexGrow: 0 }}>
            <AnalogClock size="500" />
          </Col>
          <Col>
            <h2>Neste program</h2>
            <h3>
              <Moment format={"LT"}>{scheduleJSON.results[currentProgramme].starttime}</Moment>
              {": "}
              {scheduleJSON.results[currentProgramme].video.organization.name}
            </h3>
            <h3>{scheduleJSON.results[currentProgramme].video.name}</h3>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center", marginTop: "30px", fontSize: "21pt" }}>
            Alt innhold sendt på Frikanalen av medlemsorganisasjoner er på deres eget ansvar.
            <br />
            <br />
            <span style={{ textAlign: "center", marginTop: "30px", fontSize: "17pt" }}>
              Se frikanalen.no for kontakt- og redaktørinformasjon.
            </span>
          </Col>
        </Row>
      </Container>
    </CarouselPage>
  );
}

export default function Index(props) {
  const { scheduleJSON } = props;
  return (
    <div style={{ width: "1280px", height: "720px", position: "absolute", background: Trianglify(1280, 720) }}>
      <NextUp scheduleJSON={scheduleJSON} />
    </div>
  );
  return (
    <Carousel>
      <CarouselPage duration="2">
        <h1>Page 1</h1>
      </CarouselPage>
      <CarouselPage duration="1">
        <h2>Page 2</h2>
      </CarouselPage>
    </Carousel>
  );
}
