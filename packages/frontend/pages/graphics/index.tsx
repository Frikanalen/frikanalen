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

interface CarouselPageProps {
  children?: React.ReactNode;
  duration?: number;
  title: string;
}

const CarouselPage: React.FC<CarouselPageProps> = ({ children, title, duration }) => (
  <div className="clockAndContainer">
    <Clock title={title} />
    <div className={"childElement"}>{children}</div>
    <Footer />
    <style jsx>{`
      .clockAndContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 1280px;
        height: 720px;
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

function NextUp(props) {
  const { scheduleJSON } = props;
  const currentProgramme = findRunningProgram(scheduleJSON.results) + 1;

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
          background: linear-gradient(180deg, rgba(0, 10, 20, 0.7), rgba(0, 0, 0, 0.3));
          padding-right: 100px;
          margin-left: 100px;
          justify-content: space-around;

          height: 100%;
        }
      `}</style>
    </div>
  );
}

const Clock = ({ title }) => {
  return (
    <div className="clock">
      <AnalogClock size="500" />
      <h3>{title}</h3>
      <style jsx>{`
        .clock {
          mix-blend-mode: darken;
          background: linear-gradient(135deg, rgba(50, 100, 110, 0.5), rgba(50, 50, 60, 0.7));
          border-radius: 240px 0 0 240px;
          position: absolute;
          top: 50px;
          left: 60px;
          padding: 40px;
          padding-right: 20px;
        }
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
      `}</style>
    </div>
  );
};

const Footer = () => (
  <>
    <img src="/logo.svg" className="logo" />
    <div className="divsclaimer">
      <span>Alt innhold sendes på medlemmers eget ansvar.</span>
      <br />
      Se frikanalen.no for kontakt- og redaktørinformasjon.
    </div>
    <style jsx>{`
      .divsclaimer {
        color: #555;
        font-size: 12pt;
        font-weight: 700;
        font-family: Roboto;
        padding-left: 260px;
        padding-top: 20px;
        margin: 10px;
        letter-spacing: 0.02em;
        position: absolute;
        top: 600px;
        left: 660px;
        padding: 10px;
      }
      .divsclaimer span {
        letter-spacing: 0.07em;
      }
      .logo {
        position: absolute;
        top: 588px;
        left: 275px;
        width: 400px;
        padding: 10px;
      }
    `}</style>
  </>
);

export default function Index(props) {
  const { scheduleJSON } = props;
  return (
    <TrianglifiedDiv width="1280" height="720">
      <CarouselPage title="neste program">
        <NextUp scheduleJSON={scheduleJSON} />
      </CarouselPage>
    </TrianglifiedDiv>
  );
}
