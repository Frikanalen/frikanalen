import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import dynamic from "next/dynamic";
import { APIGET } from "../../components/API/Fetch";

import Layout from "../../components/Layout";
import Video from "../../components/API/Video";
import WindowWidget from "../../components/WindowWidget";
import styles from "./VideoPage.module.sass";
import LatestVideos from "../../components/LatestVideos";

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

export default class VideoPage extends Component {
  constructor(props) {
    super(props);
    const { videoJSON } = props;
    this.video = new Video();
    this.video.loadJSON(videoJSON);
    this.state = {
      videoState: this.getStateFromVideo(),
    };
  }

  // Divine the UI-relevant state of the video. If no file is present, we
  // will sleep five seconds before checking again, because the user lands
  // straight on the video page after uploading.
  // TODO: Expose this in a better way in the Video class.
  getStateFromVideo() {
    let videoState = "";
    if (!this.video.published) {
      videoState = "unpublished";
    } else if ("theora" in this.video.files) {
      // If there is only an original/broadcast file, we can surmise that
      // the file is being processed.
      videoState = "playable";
    } else if ("original" in this.video.files || "broadcast" in this.video.files) {
      setTimeout(() => {
        this.video.load().then(() => {
          this.setState({
            videoState: this.getStateFromVideo(),
          });
        });
      }, 1000);
      videoState = "processing";
    } else {
      videoState = "nofile";
    }

    return videoState;
  }

  vodBox() {
    return <video poster={this.video.files.large_thumb} controls src={this.video.files.theora} type="video/ogg" />;
  }

  uploadBox() {
    return (
      <VideoUpload
        videoID={this.video.ID}
        onUploadComplete={() => {
          this.setState({
            videoState: "pending",
          });
          setTimeout(() => {
            this.video.load().then(() => {
              this.setState({
                videoState: this.getStateFromVideo(),
              });
            });
          }, 5000);
        }}
      />
    );
  }

  render() {
    let videoPage = null;
    const { videoState } = this.state;

    if (this.state === "unpublished") {
      videoPage = <p>Denne filen er ikke publisert</p>;
    } else if (videoState === "playable") {
      videoPage = this.vodBox();
    } else if (videoState === "nofile") {
      videoPage = this.uploadBox();
    } else if (videoState === "pending") {
      videoPage = pendingSpinnerBox();
    } else if (videoState === "processing") {
      videoPage = processingSpinnerBox();
    }

    return (
      <Layout>
        <WindowWidget invisible>
          <Container fluid>
            <Row xs={1} xl={2}>
              <Col>
                <div className={styles.videoContainer}>{videoPage}</div>
                <div className={styles.videoInfo}>
                  <h4>{this.video.name}</h4>
                  <p>
                    Publisert av
                    {" "}
                    <a href={`org/${this.video.org.ID}`}>{this.video.org.name}</a>
                  </p>
                  <p style={{ whiteSpace: "pre-line"}}>{this.video.header}</p>
                </div>
              </Col>
              <Col>
                <div className={styles.otherVideos}>
                  <h4>
                    Nyeste videoer fra
                    {" "}
                    {this.video.org.name}
                  </h4>
                  <LatestVideos orgID={this.video.org.ID} />
                </div>
              </Col>
            </Row>
          </Container>
        </WindowWidget>
      </Layout>
    );
  }
}

export async function getServerSideProps(context) {
  const videoJSON = await APIGET(`videos/${context.params.id}`);

  return {
    props: { videoJSON },
  };
}
