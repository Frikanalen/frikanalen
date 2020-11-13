import React, { Component } from "react";
import configs from "./configs";
import { find } from "domutils";

type fkVideo = {
  id: number;
};

type fkScheduleItem = {
  id: number;
  video: fkVideo;
  start_time: Date;
  end_time: Date;
};

export default class ScheduleInfo extends Component<
  { initialSchedule: fkScheduleItem[] },
  { schedule: fkScheduleItem[] }
> {
  async componentDidMount() {
    const res = await fetch(`${configs.api}scheduleitems/?days=1`);
    const json = await res.json();
    this.setState({
      schedule: json.results,
    });
  }

  as_HH_mm(datestr) {
    let d = new Date(datestr);
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  constructor(props) {
    super(props);
    const { initialJSON } = props;

    this.state = {
      schedule: initialJSON.results,
    };
  }

  render() {
    function findRunningProgram(schedule): number {
      const now = new Date();
      // FIXME: This will render wrong if the user's browser is not
      // in the Europe/Oslo timezone
      for (const id in schedule) {
        const startTime = new Date(Date.parse(schedule[id].starttime));
        const endTime = new Date(Date.parse(schedule[id].endtime));

        if (startTime <= now && endTime > now) {
          // Refresh the current running program; add 1s
          // to guard against race conditions
          setTimeout(() => {
            findRunningProgram(schedule);
          }, endTime.getTime() - now.getTime() + 1000);
          return parseInt(id);
        }
      }
    }
    const { schedule } = this.state;
    const currentItem = findRunningProgram(schedule);
    const programme_row = (programme, DOMclass) => {
      if (typeof programme === "undefined") return false;
      return (
        <div key={programme.id} className={"programme " + DOMclass}>
          <span className="times">
            <span className="startTime">{this.as_HH_mm(programme.starttime)}</span>
            <span className="endTime">{this.as_HH_mm(programme.endtime)}</span>
          </span>
          <span className="organization">{programme.video.organization.name}</span>
          <span className="lineBreak"></span>
          <span className="name">
            <a href={"v/" + programme.video.id}>{programme.video.name}</a>
          </span>
          <style jsx>{`
            .programme {
              font-family: "Roboto", sans-serif;
              margin: 0;
              padding: 10px;
              display: flex;
              padding-bottom: 5px;
              align-content: flex-start;
            }
            @media screen and (max-width: 800px) {
              .programme > .lineBreak {
                flex-basis: 100%;
                height: 0;
              }
            }

            .programme > .times {
              white-space: nowrap;
            }
            .programme.current {
              background: rgba(0, 0, 0, 0.2);
            }
            .programme > .times > .endTime::before {
              content: "–";
            }
            @media screen and (max-width: 1024px) {
              .programme {
                flex-wrap: wrap;
              }
            }
            .programme > .organization {
              margin: 0 10px;
              font-weight: bold;
            }
            .programme > .organization::after {
              content: ":";
            }
            .programme > .times > .endTime {
              margin-right: 5px;
              color: #888;
            }
          `}</style>
        </div>
      );
    };

    return (
      <span className="onRightNow">
        {currentItem != 0 ? programme_row(schedule[currentItem - 1], "previous") : null}
        {programme_row(schedule[currentItem], "current")}
        {currentItem != schedule.length ? programme_row(schedule[currentItem + 1], "next") : false}
        <style jsx>{`
          .onRightNow {
            color: white;
            background: rgba(0, 0, 0, 0.1);
            width: 100%;
          }
        `}</style>
      </span>
    );
  }
}
