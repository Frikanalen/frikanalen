import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import WindowWidget from '../components/WindowWidget'

import fetch from 'isomorphic-unfetch';
import Moment from 'react-moment';
import 'moment/locale/nb';

class Schedule extends Component {
    ScheduleItem(item) {
        return (
            <Col>
        <div className="schedule_item" key={item.scheduleitemId}>
          <div className="material-icons" style={{display:'none'}}>expand_more</div>
          <span className="start_time"><Moment format="HH:mm">{item.starttime}</Moment></span>
          <span className="end_time"><Moment format="HH:mm">{item.endtime}</Moment></span>
          <span className="publisher">
            {item.organizationName}
          </span>
          <div className="title">
            {item.videoName}
          </div>
            <style jsx>{`
            .schedule_item {
                margin: 0px 0px 5px 0px;
                color: white;
            }

            .schedule_item>.publisher,
            .schedule_item>.end_time,
            .schedule_item>.start_time {
                font-weight: bold;
            }
            .schedule_item>.publisher {
                margin-left: 10px;
            }
            .schedule_item>.end_time { 
                color: #888;
            }
            .schedule_item>.title {
                padding: 5px;
                white-space: pre-line;
                font-weight: normal;
            }
            .schedule_item>.end_time::before {
                content: "–";
            }
            `}</style>
        </div>
            </Col>
    );
    }

    static async schedule_for_date(schedule_day) {
        const query = `
          query {
          fkGetScheduleForDate(fromDate: "` +schedule_day.toISOString()+ `") {
            edges {
              node {
                scheduleitemId
                videoId
                organizationId
                starttime
                endtime
                videoName
                organizationName
              }
            }
          }
          }
        `;
        const url = env.GRAPHQL_URL;
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        };
        const res = await fetch(url, opts)
        const json = await res.json();
        const data = json.data.fkGetScheduleForDate
        return data;
    }

    static async getInitialProps(ctx) {
        const schedule_day = new Date()
        const data = await this.schedule_for_date(schedule_day);

        return {
            date: schedule_day,
            shows: data.edges.map(entry => entry.node)
        }
    };

    render() {
        const date_options = {dateStyle: 'full'}
        return (
        <Layout>
            <WindowWidget>
            <div className="schedule_date">
                <h1><Moment locale="nb" format="dddd Do MMMM">{ this.props.date }</Moment></h1>
            </div>
            <div className="programmes">
                { this.props.shows.map((schedule_item) => this.ScheduleItem(schedule_item)) }
            </div>
            <style jsx>{`
                .programmes {
                    column-count: 2;
                }

                .schedule_date {
                    text-align: center;
                    padding: 10px;
                }

                `}</style>
            </WindowWidget>
        </Layout>
        );
    }
}

export default Schedule;
