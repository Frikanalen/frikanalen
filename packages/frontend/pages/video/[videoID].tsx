import React from "react";
import { GetServerSideProps } from "next";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { APIGET, fkVideo, fkVideoQuery, fkVideoSchema } from "../../components/TS-API/API";

import Layout from "../../components/Layout";

import WindowWidget from "../../components/WindowWidget";
import styles from "./VideoPage.module.sass";
import VideoList, { getLatestVideos } from "../../components/VideoList";
import VideoWidget from "../../components/VideoWidget";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { videoID } = context.query;
  let videoJSON = null;
  let latestVideos = null;
  let error = null;

  try {
    videoJSON = await APIGET<fkVideo>({
      endpoint: `videos/${videoID}`,
      validator: fkVideoSchema.parse,
    });
    latestVideos = await getLatestVideos(videoJSON.organization);
  } catch (e) {
    console.log(e);
    context.res.statusCode = 404;
    error = "Not found!";
  }

  return {
    props: {
      error,
      videoJSON,
      latestVideos,
    },
  };
};

interface VideoPageProps {
  videoJSON: fkVideo;
  latestVideos: fkVideoQuery;
  error: Error;
}

export default function VideoPage({ videoJSON, latestVideos, error }: VideoPageProps) {
  if (error) {
    return (
      <Layout>
        <WindowWidget>
          <h1>Ikke funnet!</h1>
          <h2>Beklager. Vi fant ikke denne.</h2>
        </WindowWidget>
      </Layout>
    );
  }

  if (typeof videoJSON.organization == "number") throw new Error("Organization is integer; should be fkOrg");

  return (
    <Layout>
      <WindowWidget invisible>
        <Container fluid>
          <Row xs={1} xl={2}>
            <Col>
              <div className={styles.videoContainer}>
                <VideoWidget video={videoJSON} />
              </div>
              <div className={styles.videoInfo}>
                <h4>{videoJSON.name}</h4>
                <p>
                  Publisert av <a href={`/organization/${videoJSON.organization.id}`}>{videoJSON.organization.name}</a>
                </p>
                <p style={{ whiteSpace: "pre-line" }}>{videoJSON.header}</p>
              </div>
            </Col>
            <Col>
              <div className={styles.otherVideos}>
                <h4>Nyeste videoer fra {videoJSON.organization.name}</h4>
                <VideoList videosJSON={latestVideos} />
              </div>
            </Col>
          </Row>
        </Container>
      </WindowWidget>
    </Layout>
  );
}
