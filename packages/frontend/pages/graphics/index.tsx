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
  return <div style={{ width: "90%", height: "90%", margin: "0 auto", paddingTop: "5%" }}>{children}</div>;
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
      <div className="nextProgrammeSchedule">
        <div className="programmeText">
          <h3>
            <span className="time">
              <Moment format={"LT"}>{scheduleJSON.results[currentProgramme].starttime}</Moment>
            </span>
            {scheduleJSON.results[currentProgramme].video.organization.name}
          </h3>
          <h4>{scheduleJSON.results[currentProgramme].video.name}</h4>
        </div>
      </div>

      <style jsx>{`
        .time {
          padding-right: 30px;
        }
        .nextProgrammeSchedule {
          display: flex;
          flex-flow: column nowrap;
          height: 100%;
        }
        .programmeText h4 {
          font-family: Roboto;
          font-weight: 700;
          font-size: 27px;
          padding-left: 30px;
        }
        .programmeText h3 {
          font-family: Roboto;
          font-weight: 900;
          font-size: 37px;
        }
        .programmeText {
          padding-left: 10px;
          padding-top: 0;
          flex-grow: 1;
        }
        .nextProgramme {
          border-left: 5px solid #011f02;
          color: #c6dec3;
          background: rgba(0, 0, 0, 0.5);
          background: linear-gradient(180deg, rgba(0, 10, 20, 0.8), rgba(0, 0, 0, 0.3));
          padding-right: 100px;
          margin-left: 100px;
          justify-content: space-around;

          height: 100%;
        }
      `}</style>
    </div>
  );
}

function TwitterPage(props) {
  return (
    <CarouselPage duration="1000">
      <div className="foo">
        <div>
          <LogoClockRow />
        </div>
        <TwitterTimeline />
      </div>
      <style jsx>{`
        .foo {
          display: flex;
          height: 100%;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
        }
      `}</style>
    </CarouselPage>
  );
}

function LogoClockRow(props) {
  return (
    <div className="logoClockRow">
      <img src="/images/frikanalen.png" style={{ display: "block" }} />
      <AnalogClock size="500" />
      <style jsx>{`
        .logoClockRow {
          flex: 0 0 500px;
          display: flex;
          height: 100%;
          flex-flow: column nowrap;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

function SchedulePage(props) {
  const { scheduleJSON } = props;
  let style;

  return (
    <CarouselPage duration="1000">
      <div className="foo">
        <LogoClockRow />
        <ScheduleColumn scheduleJSON={scheduleJSON} />
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
          height: 530px;

          justify-content: space-between;
          width: 100%;
        }
      `}</style>
    </CarouselPage>
  );
}

function ClockAndWidget(props) {
  const { children } = props;

  //<h2 className="header">Neste program</h2>
  return (
    <div className="clockAndContainer">
      <img src="/images/frikanalen.png" className="logo" />
      <div className={"clock"}>
        <AnalogClock size="500" />
        <h3>neste program</h3>
      </div>
      <div className={"childElement"}>{children}</div>
      <style jsx>{`
        .clock > h3 {
          font-family: Roboto;
          font-weight: 900;
          text-align: right;
          color: #c6dec3;
          font-size: 37px;
          position: absolute;
          top: 405px;
          line-height: 90%;
          margin: 0;
          left: 234px;
          width: 220px;
        }
        .logo {
          position: absolute;
          top: 550px;
          left: 425px;

          width: 400px;
          padding: 10px;
        }
        .header {
          position: absolute;
          top: 60px;
          left: 716px;
          font-family: Roboto;
          font-weight: 900;
          text-align: center;
        }
        .clockAndContainer {
          position: absolute;
          top: 0;
          left: 0;
          width: 1280px;
          height: 720px;
        }
        .clock {
          mix-blend-mode: darken;
          background: linear-gradient(135deg, rgba(50, 100, 110, 0.5), rgba(50, 50, 60, 0.7));
          border-radius: 240px 0 0 240px;

          /*
              border-image-slice: 1;
              border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
              border-width: 40px solid;
              */
          position: absolute;
          top: 50px;
          left: 60px;
          padding: 40px;
          padding-right: 20px;
        }
        .childElement {
          position: absolute;
          top: 50px;
          left: 420px;
          height: 540px;
          width: 860px;
        }
      `}</style>
    </div>
  );
}

export default function Index(props) {
  var style;
  const { scheduleJSON } = props;
  if (true) {
    style = (
      <ClockAndWidget>
        <ScheduleColumn scheduleJSON={scheduleJSON} />
        <div className="divsclaimer">
          Alt innhold sendes på medlemmers eget ansvar.
          <br />
          Se frikanalen.no for kontakt- og redaktørinformasjon.
          <style jsx>{`
            .divsclaimer {
              color: #555;
              font-size: 12pt;
              font-weight: 700;
              font-family: Roboto;
              padding-left: 400px;
              padding-top: 0px;
              margin: 10px;
            }
          `}</style>
        </div>
      </ClockAndWidget>
    );
  } else {
    style = <SchedulePage scheduleJSON={scheduleJSON} />;
  }
  console.log("props in landing function: ", props);
  return (
    <TrianglifiedDiv width="1280" height="720">
      {style}
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
