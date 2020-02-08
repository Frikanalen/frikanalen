import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment/locale/nb';


class Schedule extends Component {
    ScheduleItem(item) {
        return (
        <div className="schedule_item" key={item.scheduleitemId}>
          <div className="material-icons" style={{display:'none'}}>expand_more</div>
          <span className="start_time"><Moment format="HH:mm">{item.starttime}</Moment></span>
          <span className="end_time"><Moment format="HH:mm">{item.endtime}</Moment></span>
          <span className="publisher">
            <Link href={"/organizations/" + item.organizationId}>
            <a>{item.organizationName}</a> 
            </Link>
          </span>
          <div className="title">
            <Link href={"/videos/" + item.videoId}>
                <a>{item.videoName}</a>
            </Link>
          </div>
            <style jsx>{`
            .schedule_item {
                margin: 0px 0px 5px 0px;
                color: white;
                font-family: inherit;
                break-inside: avoid-column;
            }

            .schedule_item>.publisher,
            .schedule_item>.end_time,
            .schedule_item>.start_time {
                font-size: 14pt;
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
    );
    }

    schedule_for_date = async (date) => {
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
        const url = process.env.GRAPHQL_URL;
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
        schedule_day = new Date()
        schedule_for_date = schedule_for_date(schedule_day);

        return {
            date: schedule_day,
            shows: data.edges.map(entry => entry.node)
        }
    };

    render() {
        const date_options = {dateStyle: 'full'}
        return (
        <Layout>
            <div className="schedule">
            <div className="schedule_date">
                <Moment locale="nb" format="dddd Do MMMM">{ this.props.date }</Moment>
            </div>
            <div className="programmes">
                { this.props.shows.map((schedule_item) => this.ScheduleItem(schedule_item)) }
            </div>
            <style jsx>{`
                .programmes {
                    padding: 10px;
                    column-count: 2;
                }

                .schedule {
                    padding: 0px 50px;
                    font-family: 'Roboto', sans-serif;
                    background: #535151;
                    max-width: 100%;
                    width: 1024px;
                }

                .schedule_date {
                    color: white;
                    text-align: center;
                    font-size: 20pt;
                    font-weight: bold;
                    padding: 20px;
                }

                @media screen and (max-width: 1024px) {
                    .programmes {
                        column-count: 1;
                    }
                    .schedule {
                        padding: 0px 0px;
                    }
                }
                `}</style>
            </div>
        </Layout>
        );
    }
}

export default Schedule;
