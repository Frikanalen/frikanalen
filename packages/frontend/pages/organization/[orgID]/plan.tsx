import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import WindowWidget from "../../../components/WindowWidget";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { getLatestVideos } from "../../../components/VideoList";
import { useRouter } from "next/router";
import { APIGET, fkOrgJSON, fkVideoJSON } from "../../../components/TS-API/API";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import {
  eachDayOfInterval,
  endOfISOWeek,
  getISOWeek,
  lastDayOfISOWeek,
  lastDayOfYear,
  setISOWeek,
  startOfISOWeek,
} from "date-fns";
import { eachWeekOfInterval } from "date-fns";
import Moment from "react-moment";
import "moment/locale/nb";
import fetch from "isomorphic-unfetch";
import configs from "../../../components/configs";
import moment from "moment";
import styles from "./plan.module.sass";
import config from "components/configs";

export async function getServerSideProps(context) {
  const orgIDString = context.query.orgID;
  const orgID = parseInt(orgIDString);
  const { name } = await APIGET<fkOrgJSON>({ endpoint: `organization/${orgID}` });

  return {
    props: {
      orgName: name,
      orgID,
    },
  };
}

function VideoSearchBox(props) {
  const { initialVideo, orgID, onVideoChange } = props;
  const [originalVideo, setOriginalVideo] = useState(initialVideo);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(initialVideo !== undefined ? [initialVideo] : []);

  const searchFkVideos = (query: string): void => {
    setIsLoading(true);
    fetch(`${config.api}videos/?name__icontains=${query}`)
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);
        setOptions(data.results);
      });
  };

  return (
    <AsyncTypeahead
      id={"video-title-search"}
      isLoading={isLoading}
      onChange={(v) => onVideoChange(v[0])}
      labelKey={(option) => `${option.name}`}
      onSearch={(query) => {
        searchFkVideos(query);
      }}
      options={[originalVideo].concat(options)}
      defaultSelected={originalVideo !== undefined ? [originalVideo] : []}
    />
  );
}

function ScheduleItem(props) {
  const { initialData } = props;

  const [editMode, setEditMode] = useState(initialData == null ? true : false);
  const [itemID, setItemID] = useState(initialData?.id);
  const [startTime, setStartTime] = useState(initialData?.starttime);
  const [endTime, setEndTime] = useState(initialData?.endtime);
  const [videoJSON, setVideoJSON] = useState(initialData?.video);
  const [orgName, setOrgName] = useState(initialData?.video?.organization?.name);
  const [orgID, setOrgID] = useState(initialData?.video?.organization?.id);

  useEffect(() => {
    if (videoJSON) {
      setEndTime(moment(startTime).add(videoJSON.duration));
    }
  }, [videoJSON, startTime]);

  if (videoJSON == null) {
    const { orgID } = useRouter().query;
    APIGET<fkOrgJSON>({ endpoint: `organization/${orgID}` }).then((n) => setOrgName(n.name));
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
  };

  if (editMode) {
    return (
      <Row className={styles.scheduleItem} onClick={() => setEditMode(true)}>
        <Container fluid>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className={styles.startTime}>
                <Form.Control
                  type="time"
                  onChange={(e) => {
                    let [hours, minutes] = e.target.value.split(":").map(Number);
                    setStartTime(moment(startTime).set({ hour: hours, minute: minutes }));
                  }}
                  value={moment(startTime).format("HH:mm")}
                />
              </Col>
              &mdash;
              <Col className={styles.endTime}>
                <Moment format={"HH:mm"}>{endTime}</Moment>
              </Col>
              <Col className={styles.videoOrg}>{orgName}</Col>
            </Row>
            <Row>
              <Col className={styles.videoTitle}>
                <VideoSearchBox initialVideo={videoJSON} orgID={orgID} onVideoChange={setVideoJSON} />
              </Col>
              <Col style={{ flexGrow: 0 }}>
                <Button variant="primary" type="submit">
                  Lagre
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Row>
    );
  } else
    return (
      <Row className={styles.scheduleItem} onClick={() => setEditMode(true)}>
        <Container fluid>
          <Row>
            <Col className={styles.startTime}>
              <Moment format={"HH:mm"}>{startTime}</Moment>
            </Col>
            &mdash;
            <Col className={styles.endTime}>
              <Moment format={"HH:mm"}>{endTime}</Moment>
            </Col>
            <Col className={styles.videoOrg}>{orgName}</Col>
          </Row>
          <Row>
            <Col className={styles.videoTitle}>{videoJSON?.name}</Col>
          </Row>
        </Container>
      </Row>
    );
}

function Schedule(props) {
  const { scheduleDate } = props;
  const [scheduleData, setScheduleData] = useState(null);

  const loadSchedule = useEffect(() => {
    const YYYYMMDD = moment(scheduleDate).format("YYYYMMDD");
    fetch(`${configs.api}scheduleitems/?days=1&date=${YYYYMMDD}`)
      .then((r) => r.json())
      .then((s) => {
        setScheduleData(s.results);
      });
  }, [scheduleDate]);

  if (scheduleData == null) return <p>Laster for dato...</p>;

  return (
    <Container fluid>
      <ScheduleItem initialData={null} />
      {scheduleData.map((i) => (
        <ScheduleItem initialData={i} />
      ))}
    </Container>
  );
}

function WeekdaySelector(props) {
  const { year, week, setScheduleDate } = props;
  const startDate = startOfISOWeek(setISOWeek(year, week));
  const endDate = endOfISOWeek(startDate);
  const dayList = eachDayOfInterval({ start: startDate, end: endDate });

  const dayButton = (date) => {
    return (
      <Button key={date} onClick={() => setScheduleDate(date)}>
        <Moment format="dddd D. MMMM">{date}</Moment>
      </Button>
    );
  };

  return <div>{dayList.map((d) => dayButton(d))}</div>;
}

type weekSetCallback = (number) => void;

function WeekSelector(props) {
  const weekButton = (weekStart: Date, weekSet: weekSetCallback) => {
    return (
      <Col key={getISOWeek(weekStart)}>
        <Button onClick={() => weekSet(getISOWeek(weekStart))}>
          Uke {getISOWeek(weekStart)}
          :
          <br />
          <Moment format="D. MMMM">{weekStart}</Moment>
          &mdash;
          <br />
          <Moment format="D. MMMM">{lastDayOfISOWeek(weekStart)}</Moment>
        </Button>
      </Col>
    );
  };

  const { year, week, weekSet } = props;
  const weekList = eachWeekOfInterval({ start: year, end: lastDayOfYear(year) }, { weekStartsOn: 1 });

  return (
    <Container fluid>
      <Row sm={4}>{weekList.map((weekStart) => weekButton(weekStart, weekSet))}</Row>
    </Container>
  );
}

export default function Plan(props) {
  const year = new Date();
  const [week, setWeek] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const { orgName, orgID, latestVideos } = props;

  let currentDialog;

  if (week == null) {
    currentDialog = <WeekSelector year={year} week={week} weekSet={setWeek} />;
  } else {
    if (scheduleDate == null) {
      currentDialog = (
        <React.Fragment>
          <Button onClick={() => setWeek(null)}>Uke {week}</Button>
          <WeekdaySelector year={year} week={week} scheduleDate={scheduleDate} setScheduleDate={setScheduleDate} />
        </React.Fragment>
      );
    } else {
      currentDialog = (
        <React.Fragment>
          <Button
            onClick={() => {
              setWeek(null);
              setScheduleDate(null);
            }}
          >
            Uke {week}
          </Button>
          <Button onClick={() => setScheduleDate(null)}>
            <Moment format="dddd D. MMMM">{scheduleDate}</Moment>
          </Button>
          <Schedule scheduleDate={scheduleDate} />
        </React.Fragment>
      );
    }
  }

  return (
    <Layout>
      <Container fluid>
        <WindowWidget>
          <h2>{orgName}</h2>
          <Alert variant={"primary"}>
            <Alert.Heading>Dette er en prototype!</Alert.Heading>I enda større grad enn de andre funksjonene på
            nettsiden.
          </Alert>
          {currentDialog}
        </WindowWidget>
      </Container>
    </Layout>
  );
}
