import React, { Component, useState, useEffect, useRef } from "react";

import fetch from "isomorphic-unfetch";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/nb";
import WindowWidget from "../components/WindowWidget";
import configs from "../components/configs";
import Layout from "../components/Layout";


async function scheduleForDate(date) {
  const res = await fetch(`${configs.api}scheduleitems/?days=1&date=${moment(date).format("YYYYMMDD")}`);
  const json = await res.json();
  return json.results;
}

export async function getServerSideProps(context) {
    const res = await fetch(`${configs.api}scheduleitems/?days=1`);
    const json = await res.json();
    const scheduleJSON = json.results;
    const date = moment().toJSON();
    return {
        props: {
            scheduleJSON,
            date,
        }
    }
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
        <a href={`/organization/${item.video.organization.id}`}>{item.video.organization.name}</a>
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

export default function Schedule(props) {
    const [ date, setDate ] = useState(props.date)
    const [ scheduleJSON, setScheduleJSON ] = useState(props.scheduleJSON)
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        scheduleForDate(date).then((s)=>setScheduleJSON(s))
    }, [ date ]);


    return (
      <Layout>
        <WindowWidget>
          <div style={{ display: "flex" }}>
            <h1 onClick={() => setDate(moment(date).add(-1, 'days'))}
                style={{ cursor: "pointer", lineHeight: "75.6px", fontSize: "56px", padding: "10px 0" }}
                className="material-icons">
                navigate_before
            </h1>
            <h1 style={{ flexGrow: 1, textAlign: "center" }} className="schedule_date">
              <Moment locale="nb" format="dddd Do MMMM">
                {date}
              </Moment>
            </h1>
              <h1 onClick={() => setDate(moment(date).add(1, 'days'))}
                  style={{ cursor: "pointer", lineHeight: "75.6px", fontSize: "56px", padding: "10px 0" }}
                  className="material-icons">
                  navigate_next
              </h1>
          </div>
          <div className="programmes">{scheduleJSON.map((x) => ScheduleItem(x))}</div>
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
