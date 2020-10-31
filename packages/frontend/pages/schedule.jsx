import React, { Component } from "react";

import fetch from "isomorphic-unfetch";
import Moment from "react-moment";
import moment from "moment";
import WindowWidget from "../components/WindowWidget";
import configs from "../components/configs";
import Layout from "../components/Layout";
import "moment/locale/nb";

async function scheduleForDate(date) {
  const res = await fetch(`${configs.api}scheduleitems/?days=1&date=${moment(date).format("YYYYMMDD")}`);
  const json = await res.json();
  return json.results;
}

function ScheduleItem(item) {
  return (
    <div className="schedule_item" key={item.id}>
      <div className="material-icons" style={{ display: "none" }}>
        expand_more
      </div>
      <span className="start_time">
        <Moment format="HH:mm">{item.starttime}</Moment>
      </span>
      <span className="end_time">
        <Moment format="HH:mm">{item.endtime}</Moment>
      </span>
      <span className="publisher">
        <a href={`/org/${item.video.organization.id}`}>{item.video.organization.name}</a>
      </span>
      <div className="title">
        <a href={`/v/${item.video.id}`}>{item.video.name}</a>
      </div>
      <style jsx>
        {`
          .schedule_item {
            break-inside: avoid-column;
            padding: 0px 0px 0px 0px;
            color: white;
          }

          .schedule_item > .publisher,
          .schedule_item > .end_time,
          .schedule_item > .start_time {
            font-weight: bold;
          }
          .schedule_item > .publisher {
            margin-left: 10px;
          }
          .schedule_item > .end_time {
            color: #888;
          }
          .schedule_item > .title {
            padding: 5px;
            white-space: pre-line;
            font-weight: normal;
          }
          .schedule_item > * > a {
            link-decoration: none;
            color: #9bb5f2;
            font-weight: bold;
          }
          .schedule_item > .end_time::before {
            content: "–";
          }
        `}
      </style>
    </div>
  );
}

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      shows: [],
    };
  }

  async componentDidMount() {
    const { date } = this.state;
    const schedule = await scheduleForDate(date);

    this.setState({
      shows: schedule,
    });
  }

  render() {
    const { date, shows } = this.state;
    return (
      <Layout>
        <WindowWidget>
          <div className="schedule_date">
            <h1>
              <Moment locale="nb" format="dddd Do MMMM">
                {date}
              </Moment>
            </h1>
          </div>
          <div className="programmes">{shows.map((x) => ScheduleItem(x))}</div>
          <style jsx>
            {`
                .programmes {
                    column-count: 2;
                }
                @media only screen and (max-width: 768px) {
                    .programmes {
                        column-count: 1;
                    }
                }
             }

             .schedule_date {
                 text-align: center;
                 padding: 10px;
             }`}
          </style>
        </WindowWidget>
      </Layout>
    );
  }
}

export default Schedule;
