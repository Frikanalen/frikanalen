import Layout from "../components/Layout";
import configs from "../components/configs";
import Link from "next/link";
import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import WindowWidget from "../components/WindowWidget";

import fetch from "isomorphic-unfetch";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/nb";

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: moment(),
            shows: [],
        };
    }

    ScheduleItem(item) {
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
            <span className="publisher">{item.video.organization.name}</span>
            <div className="title">{item.video.name}</div>
            <style jsx>{`
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
          .schedule_item > .end_time::before {
            content: "–";
          }
        `}</style>
            </div>
        );
    }

    async schedule_for_date(schedule_day) {
        const res = await fetch(
            configs.api + "scheduleitems/?days=1&date=" + moment(this.state.date).format('YYYYMMDD')
        );
        const json = await res.json()
        return json.results;
    }

    async componentDidMount() {
        const schedule = await this.schedule_for_date(this.state.date);

        this.setState({
            shows: schedule,
        });
    }

    render() {
        const date_options = { dateStyle: "full" };
        return (
            <Layout>
            <WindowWidget>
            <div className="schedule_date">
            <h1>
            <Moment locale="nb" format="dddd Do MMMM">
            {this.state.date}
            </Moment>
            </h1>
            </div>
            <div className="programmes">
            {this.state.shows.map((x) => this.ScheduleItem(x))}
            </div>
            <style jsx>{`
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
             }`}</style>
            </WindowWidget>
            </Layout>
        );
    }
}

export default Schedule;
