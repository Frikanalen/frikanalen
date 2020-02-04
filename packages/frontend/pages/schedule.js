import Layout from '../components/Layout';
import * as env from '../components/constants';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';

class Schedule extends Component {
    ScheduleItem(item) {
        let start_date = new Date(item.starttime); 
        // This cannot possibly be the right way to do this
        let start_time_str = (("0" + start_date.getHours()).slice(-2) + 
            ":" + ("0" + start_date.getMinutes()).slice(-2));
        let end_date = new Date(item.endtime); 
        let end_time_str = (("0" + end_date.getHours()).slice(-2) + 
            ":" + ("0" + end_date.getMinutes()).slice(-2));
        return (
        <div className="schedule_item" key={item.scheduleitemId}>
            <div className="material-icons" style={{display:'none'}}>expand_more</div>
          <div className="start_time">{start_time_str}</div>
          <div className="end_time">{end_time_str}</div>
            <div className="publisher">
            <Link href={"/organizations/" + item.organizationId}>
            <a>{item.organization_name}</a> 
            </Link>
            </div>
          <div className="title">
            <Link href={"/videos/" + item.videoId}>
                <a>{item.videoName}</a>
            </Link>
          </div>
            <style jsx>{`
            .schedule_item {
                margin: 0px 0px 10px 0px;
                color: white;
                font-family: inherit;
                font-weight: bold;
                break-inside: avoid-column;
            }
            .schedule_item>.end_time { 
                display: inline-block;
                color: #888;
            }
            .schedule_item>.start_time { 
                display: inline-block;
                color: white;
            }
            .schedule_item>.title>a, .schedule_item>.title>a:link {
                text-decoration: none;
                color: white;
                break-after: column;
            }
            .schedule_item>.title {
                white-space: pre-line;
            }
            .schedule_item>.category {
                text-transform: lowercase;
                margin: 0 5px 0 5px;
                grid-area: category;
                background: black;
                text-align: center;
            }
            .schedule_item>.end_time::before {
                content: "–";
            }
            `}</style>
        </div>
    );
    }

    static async getInitialProps(ctx) {
        const query = `
          query {
          fkGetScheduleForDate(fromDate: "` +new Date().toISOString()+ `") {
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
        const url = "https://dev.frikanalen.no/graphql";
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        };
        const res = await fetch(url, opts)
        const json = await res.json();
        const data = json.data.fkGetScheduleForDate

        return {
            shows: data.edges.map(entry => entry.node)
        }
    };

    render() {
        const date_options = {dateStyle: 'full'}
        return (
        <Layout>
            <div className="schedule">
            <div className="schedule_date">
                { new Date().toLocaleDateString('nb-NO', date_options) }
            </div>
            <div className="programmes">
                { this.props.shows.map((schedule_item) => this.ScheduleItem(schedule_item)) }
            </div>
            <style jsx>{`
                li {
                    list-style: none;
                }

                .programmes {
                    padding: 10px;
                    column-count: 2;
                }

                .schedule {
                    padding: 0px 50px;
                    font-family: 'Roboto', sans-serif;
                    background: #535151;
                    max-width: 1024px;
                    width: 1024px;
                }

                .schedule_date {
                    color: white;
                    text-align: center;
                    font-size: 20pt;
                    font-weight: bold;
                    padding: 20px;
                }
                `}</style>
            </div>
        </Layout>
        );
    }
}

export default Schedule;
