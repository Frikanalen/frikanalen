import Link from "next/link";
import configs from "./configs";
import React, { Component } from "react";
export class ScheduleInfo extends Component {
  async componentWillMount() {
    const foo = await fetch(configs.api + "scheduleitems/?days=1");
    const json = await foo.json();
    this.setState({
      schedule: json.results,
    });
    this.findRunningProgram();
    this.setState({
      ready: true,
    });
  }

  findRunningProgram() {
    const now = new Date();
    var currentItem;
    // FIXME: This will render wrong if the user's browser is not
    // in the Europe/Oslo timezone
    for (let id in this.state.schedule) {
      const startTime = new Date(Date.parse(this.state.schedule[id].starttime));
      const endTime = new Date(Date.parse(this.state.schedule[id].endtime));
      if (startTime <= now && endTime > now) {
        currentItem = parseInt(id);
        console.log(id, this.state.schedule[id]);
        break;
      }
    }
    this.setState({
      currentItem: currentItem,
    });
  }

  as_HH_mm(datestr) {
    let d = new Date(datestr);
    return (
      ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
    );
  }

  constructor(props) {
    super(props);
    this.state = { ready: false };
  }

  render() {
    const programme_row = (programme, DOMclass) => {
      return (
        <div className={"programme " + DOMclass}>
          <span className="times">
            <span className="startTime">
              {this.as_HH_mm(programme.starttime)}
            </span>
            <span className="endTime">{this.as_HH_mm(programme.endtime)}</span>
          </span>
          <span className="organization">
            {programme.video.organization.name}
          </span>
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

    if (!this.state.ready) return null;
    else {
      console.log(typeof this.state.currentItem);
      return (
        <span className="onRightNow">
          {(this.state.currentItem != 0) ?  programme_row( this.state.schedule[this.state.currentItem - 1], "previous") : null}
          {programme_row(
            this.state.schedule[this.state.currentItem],
            "current"
          )}
          {(this.state.currentItem == this.state.schedule.length) ?  programme_row( this.state.schedule[this.state.currentItem + 1], "next") : null}
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
}

export default ScheduleInfo;
