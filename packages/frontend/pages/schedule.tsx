import React, { useState, useEffect, useRef } from "react";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/nb";
import WindowWidget from "../components/WindowWidget";
import Layout from "../components/Layout";
import { APIGET, fkSchedule, fkScheduleItem, fkScheduleSchema } from "../components/TS-API/API";
import { GetServerSideProps } from "next";

async function scheduleForDate(date: moment.Moment): Promise<fkSchedule> {
  const queryString = `scheduleitems/?days=1&date=${moment(date).format("YYYYMMDD")}`;
  return APIGET<fkSchedule>({
    endpoint: queryString,
    validator: fkScheduleSchema.parse,
  });
}

export const getServerSideProps: GetServerSideProps = async () => {
  const scheduleJSON = await APIGET<fkSchedule>({
    endpoint: `scheduleitems/?days=1`,
    validator: fkScheduleSchema.parse,
  });
  const date = moment().toJSON();
  return {
    props: {
      scheduleJSON,
      date,
    },
  };
};

function ScheduleItem(item: fkScheduleItem): JSX.Element {
  if (item.video === null) {
    return <></>;
  }

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
        <a href={`/video/${item.video.id}`}>{item.video.name}</a>
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

interface ScheduleProps {
  date: moment.Moment;
  scheduleJSON: fkSchedule;
}

export default function Schedule(props: ScheduleProps): JSX.Element {
  const [date, setDate] = useState(props.date);
  const [scheduleJSON, setScheduleJSON] = useState(props.scheduleJSON);
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    // FIXME: Do error handling here
    scheduleForDate(date).then((s) => setScheduleJSON(s)).catch((reason)=>{console.log(reason)});
  }, [date]);

  return (
    <Layout>
      <WindowWidget>
        <div style={{ display: "flex" }}>
          <h1
            onClick={(): void => setDate(moment(date).add(-1, "days"))}
            style={{ cursor: "pointer", lineHeight: "75.6px", fontSize: "56px", padding: "10px 0" }}
            className="material-icons"
          >
            navigate_before
          </h1>
          <h1 style={{ flexGrow: 1, textAlign: "center" }} className="schedule_date">
            <Moment locale="nb" format="dddd Do MMMM">
              {date}
            </Moment>
          </h1>
          <h1
            onClick={(): void => setDate(moment(date).add(1, "days"))}
            style={{ cursor: "pointer", lineHeight: "75.6px", fontSize: "56px", padding: "10px 0" }}
            className="material-icons"
          >
            navigate_next
          </h1>
        </div>
        <div className="programmes">{scheduleJSON.results.map((x: fkScheduleItem) => ScheduleItem(x))}</div>
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
