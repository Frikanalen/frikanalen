import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import dynamic from "next/dynamic";

import Layout from "../../components/Layout";
import Organization from "../../components/API/Organization";
import Video from "../../components/API/Video";
import WindowWidget from "../../components/WindowWidget";
import configs from "../../components/configs";
import styles from "./VideoPage.module.sass";

const VideoUpload = dynamic(() => import("../../components/VideoUpload"), {
  ssr: false,
});

import { APIGET } from "../../components/API/Fetch.js";
import { Component } from "react";

export default class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.video = new Video();
    this.video.loadJSON(props.videoJSON);
  }

  vodBox() {
    return (
      <video
        className="player"
        poster={this.video.files.large_thumb}
        controls
        src={this.video.files.theora}
        type="video/ogg"
      />
    );
  }

  render() {
    var videoPage = null;
    if (!this.video.published) {
      videoPage = <p>Denne filen er ikke publisert</p>;
    } else if (!Object.keys(this.video.files).length) {
      console.log("this video ID:", this.video);
      videoPage = <VideoUpload videoID={this.video.ID} />;
    } else {
      videoPage = this.vodBox();
    }
    return (
      <Layout>
        <WindowWidget invisible>
          <Container fluid>
            <Row xl={2}>
              <Col className="videoBox">
                <h3>{this.video.name}</h3>
                <p>
                  Publisert av{" "}
                  <a href={"/org/" + this.video.org.ID}>
                    {this.video.org.name}
                  </a>
                </p>
              </Col>
              {videoPage}
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
