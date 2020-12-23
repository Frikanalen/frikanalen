import React, { createRef, useState } from "react";
import { APIGET, fkScheduleJSON } from "components/TS-API/API";
import Moment from "react-moment";
import dynamic from "next/dynamic";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { findRunningProgram } from "../../components/ScheduleInfo";
import "moment/locale/nb";
import { UserContextState } from "../../components/UserContext";

const TrianglifiedDiv = dynamic(() => import("components/graphics/background.js"), { ssr: false });
const AnalogClock = dynamic(() => import("components/graphics/analogclock.js"), { ssr: false });
const TwitterTimeline = dynamic(() => import("components/graphics/twittertimeline.js"), { ssr: false });

export async function getServerSideProps(context: UserContextState) {
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
  return <div style={{ width: "90%", height: "90%", margin: "0 auto" }}>{children}</div>;
}

function ScheduleColumn(props) {
  const { scheduleJSON } = props;
  const currentProgramme = findRunningProgram(scheduleJSON.results) + 1;
  console.log("props:");
  console.log(props);
  console.log("CurrentProgramme:");
  console.log(currentProgramme);
  console.log("scheduleJSON:");
  console.log(scheduleJSON);

  return (
    <div className="nextProgramme">
      <h2>Neste program</h2>
      <div className="nextProgrammeSchedule">
        <h3>
          <Moment format={"LT"}>{scheduleJSON.results[currentProgramme].starttime}</Moment>
        </h3>
        <div className="programmeText">
          <h3>{scheduleJSON.results[currentProgramme].video.organization.name}</h3>
          <h4>{scheduleJSON.results[currentProgramme].video.name}</h4>
        </div>
      </div>

      <style jsx>{`
        .nextProgramme h2 {
          font-family: Roboto;
          font-weight: 900;
          text-align: center;
        }
        .nextProgrammeSchedule {
          display: flex;
          flex-flow: row nowrap;
        }
        .programmeText {
          background: white;
          border-left: 5px solid black;
          padding-left: 10px;
          padding-top: 0;
          margin-left: 10px;
        }
        .nextProgramme {
          margin-top: 140px;

          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}

function TwitterColumn(props) {
  return (
    <Col>
      <TwitterTimeline />
    </Col>
  );
}

function LogoClockRow(props) {
  return (
    <div className="logoClockRow">
      <div>
        <img src="/images/frikanalen.png" style={{ display: "block", margin: "30px", marginLeft: "50px" }} />
      </div>
      <AnalogClock size="500" />
      <style jsx>{`
        .logoClockRow {
          flex: 0 0 500px;
          display: flex;
          height: 100%;
          flex-flow: column nowrap;
          justify-content: space-evenly;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

function InfoPanel(props) {
  const { scheduleJSON } = props;
  let style;
  if (readPageStyle() === "twitter") {
    style = <TwitterColumn />;
  } else {
    style = <ScheduleColumn scheduleJSON={scheduleJSON} />;
  }

  return (
    <CarouselPage duration="1000">
      <div className="foo">
        <LogoClockRow />
        {style}
      </div>
      <Container fluid>
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
      <style jsx>{`
        .foo {
          display: flex;
          height: 570px;

          justify-content: space-between;
          width: 100%;
        }
      `}</style>
    </CarouselPage>
  );
}

function readPageStyle() {
  const params = new URLSearchParams(location.search);
  const style = params.get("style");
  if (style === "twitter") {
    return "twitter";
  }
  return "schedule";
}

export default function Index(props) {
  const { scheduleJSON } = props;
  console.log("props in landing function: ", props);
  return (
    <TrianglifiedDiv width="1280" height="720">
      <InfoPanel className="foo" scheduleJSON={scheduleJSON} />
      <style jsx>{`
        .foo {
          background: red;
        }
      `}</style>
    </TrianglifiedDiv>
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
