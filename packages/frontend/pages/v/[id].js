import dynamic from "next/dynamic";

import { Component } from "react";
import { APIGET } from "../../components/API/Fetch.js";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import Layout from "../../components/Layout";
import Organization from "../../components/API/Organization";
import Video from "../../components/API/Video";
import WindowWidget from "../../components/WindowWidget";
import configs from "../../components/configs";
import styles from "./VideoPage.module.sass";

const VideoUpload = dynamic(() => import("../../components/VideoUpload"), {
  ssr: false,
});
//const ShakaPlayer = dynamic(() => import('shaka-player-react'), { ssr: false });

export default class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.video = new Video();
    this.video.loadJSON(props.videoJSON);
    this.state = {
      videoState: this.getStateFromVideo(),
    };
  }

  // Divine the UI-relevant state of the video. If no file is present, we
  // will sleep five seconds before checking again, because the user lands
  // straight on the video page after uploading.
  // TODO: Expose this in a better way in the Video class.
  getStateFromVideo() {
    console.log(this.video.files);
    var videoState = "";
    if (!this.video.published) {
      videoState = "unpublished";
    } else {
      // If there is only an original/broadcast file, we can surmise that
      // the file is being processed.
      if ("theora" in this.video.files) {
        videoState = "playable";
      } else {
        if ("original" in this.video.files || "broadcast" in this.video.files) {
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
      }
    }

    console.log(this.video.files, videoState);
    return videoState;
  }

  vodBox() {
    return (
      <video
        poster={this.video.files.large_thumb}
        controls
        src={this.video.files.theora}
        type="video/ogg"
      />
    );
  }

  processingSpinnerBox() {
    return (
      <div>
        <Spinner animation="border" />
      </div>
    );
  }

  pendingSpinnerBox() {
    return (
      <div>
        <Spinner animation="border" />
      </div>
    );
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
    var videoPage = null;

    console.log(this.state);

    if (this.state == "unpublished") {
      videoPage = <p>Denne filen er ikke publisert</p>;
    } else if (this.state.videoState == "playable") {
      videoPage = this.vodBox();
    } else if (this.state.videoState == "nofile") {
      videoPage = this.uploadBox();
    } else if (this.state.videoState == "pending") {
      videoPage = this.pendingSpinnerBox();
    } else if (this.state.videoState == "processing") {
      videoPage = this.processingSpinnerBox();
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
                    Publisert av{" "}
                    <a href={"/org/" + this.video.org.ID}>
                      {this.video.org.name}
                    </a>
                  </p>
                </div>
              </Col>
              <Col>
                <div className={styles.otherVideos}>
                  <h4>Nyeste videoer fra {this.video.org.name}</h4>
                  <Alert variant="info">
                    <Alert.Heading>Funksjonen kommer snart!</Alert.Heading>
                    Frikanalen.no utvikles aktivt.
                  </Alert>
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
  var orgData = null;
  const videoJSON = await APIGET("videos/" + context.params.id);

  return {
    props: { videoJSON: videoJSON },
  };
}
