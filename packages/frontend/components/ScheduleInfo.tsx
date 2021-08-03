import React, { Component } from "react";
import Link from "next/link";
import { APIGET, fkSchedule, fkScheduleItem } from "components/TS-API/API";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ScheduleInfo.module.sass";

export function findRunningProgram(schedule: fkScheduleItem[]): number {
  const now = new Date();
  // FIXME: This will render wrong if the user's browser is not
  // in the Europe/Oslo timezone

  for (const id of schedule.keys()) {
    const startTime = new Date(Date.parse(schedule[id].starttime));
    const endTime = new Date(Date.parse(schedule[id].endtime));

    if (startTime <= now && endTime > now) {
      // Refresh the current running program; add 1s
      // to guard against race conditions
      setTimeout(() => {
        findRunningProgram(schedule);
      }, endTime.getTime() - now.getTime() + 1000);
      return id;
    }
  }
  return 0;
}

function as_HH_mm(datestr: string): string {
  const d = new Date(datestr);
  const paddedHours = (`0${d.getHours()}`).slice(-2)
  const paddedMinutes = (`0${d.getMinutes()}`).slice(-2)
  return `${paddedHours}:${paddedMinutes}`
}

interface ScheduleInfoProps {
  initialSchedule: fkSchedule;
}
interface ScheduleInfoState {
  schedule: fkScheduleItem[];
}
export default class ScheduleInfo extends Component<ScheduleInfoProps, ScheduleInfoState> {
  public async componentDidMount(): Promise<void> {
    const json = await APIGET<fkSchedule>({ endpoint: `scheduleitems/?days=1` });
    this.setState({
      schedule: json.results,
    });
  }

  constructor(props: ScheduleInfoProps) {
    super(props);
    const { initialSchedule } = props;

    this.state = {
      schedule: initialSchedule.results,
    };
  }

  render(): JSX.Element {
    const { schedule } = this.state;
    const currentItem = findRunningProgram(schedule);
    const programmeRow = (programme: fkScheduleItem | null, DOMclass: string): JSX.Element => {
      if (programme == null) {
        return <></>;
      }

      let video = {
        name: "No video",
        id: 0,
      };
      let organization = {
        name: "No organization",
        id: 0,
      };

      if (programme.video) {
        video = programme.video;
        organization = programme.video.organization;
      }

      return (
        <Container className={styles.programme + " " + DOMclass} fluid>
          <Row key={programme.id}>
            <Col className={styles.times}>
              <span className={styles.startTime}>{as_HH_mm(programme.starttime)}</span>
              <span className={styles.endTime}>–{as_HH_mm(programme.endtime)}</span>
            </Col>
            <Col>
              <Link href={`/organization/${organization.id}`}>
                <a className={styles.organization}>{organization.name}</a>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="name">
                <a href={`video/${video.id}`}>{video.name}</a>
              </span>
            </Col>
          </Row>
        </Container>
      );
    };

    return (
      <div className={"onRightNow"}>
        {currentItem != 0 ? programmeRow(schedule[currentItem - 1], "previous") : null}
        {programmeRow(schedule[currentItem], styles.current)}
        {currentItem != schedule.length ? programmeRow(schedule[currentItem + 1], "next") : false}
        <style jsx>{`
          .onRightNow {
            color: white;
            background: rgba(0, 0, 0, 0.1);
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}
