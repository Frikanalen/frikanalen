import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import dynamic from "next/dynamic";
import { APIGET, fkVideoJSON } from "../../components/TS-API/API";

import Layout from "../../components/Layout";

import WindowWidget from "../../components/WindowWidget";
import styles from "./VideoPage.module.sass";
import VideoList, { getLatestVideos } from "../../components/VideoList";

const VideoUpload = dynamic(() => import("../../components/VideoUpload"), {
  ssr: false,
});

function processingSpinnerBox() {
  return (
    <div>
      <Spinner animation="border" />
    </div>
  );
}

function pendingSpinnerBox() {
  return (
    <div>
      <Spinner animation="border" />
    </div>
  );
}

// Divine the UI-relevant state of the video. If no file is present, we
// will sleep five seconds before checking again, because the user lands
// straight on the video page after uploading.
// TODO: Expose this in a better way in the Video class.
function getStateFromVideo(video: fkVideoJSON) {
  let videoState;

  if (!video.publish_on_web) {
    videoState = "unpublished";
  } else if ("theora" in video.files) {
    // If there is only an original/broadcast file, we can surmise that
    // the file is being processed.
    videoState = "playable";
  } else if ("original" in video.files || "broadcast" in video.files) {
    setTimeout(() => {
      APIGET<fkVideoJSON>(`videos/${video.id}`).then((v) => {
        this.setState({
          videoState: getStateFromVideo(v),
        });
      });
    }, 1000);
    videoState = "processing";
  } else {
    videoState = "nofile";
  }

  return videoState;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { videoID } = context.query;
  let videoJSON = null;
  let latestVideos = null;
  let error = null;
  try {
    videoJSON = await APIGET<fkVideoJSON>(`videos/${videoID}`);
    latestVideos = await getLatestVideos(videoJSON.organization.id);
  } catch (e) {
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

export default function VideoPage(props) {
  const { videoJSON, latestVideos, error } = props;

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

  const [videoWidget, setVideoWidget] = useState(null);
  const [videoState, setVideoState] = useState(getStateFromVideo(videoJSON));

  useEffect(() => {
    if (videoState === "unpublished") {
      setVideoWidget(<p>Denne filen er ikke publisert</p>);
    } else if (videoState === "playable") {
      setVideoWidget(
        <video poster={videoJSON.files.large_thumb} controls>
          <source src={videoJSON.files.theora} type="video/ogg" />
        </video>
      );
    } else if (videoState === "nofile") {
      setVideoWidget(
        <VideoUpload
          videoJSON={videoJSON}
          onUploadComplete={() => setVideoState("pending")}
          className={styles.videoUploadBox}
        />
      );
    } else if (videoState === "pending") {
      setVideoWidget(pendingSpinnerBox());
    } else if (videoState === "processing") {
      setVideoWidget(processingSpinnerBox());
    }
  }, [videoState]);

  return (
    <Layout>
      <WindowWidget invisible>
        <Container fluid>
          <Row xs={1} xl={2}>
            <Col>
              <div className={styles.videoContainer}>{videoWidget}</div>
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
