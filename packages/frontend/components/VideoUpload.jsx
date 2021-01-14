import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import { getUploadToken } from "./TS-API/API";

import { UserContext } from "./UserContext";
import styles from "./VideoUpload.module.sass";

//let Resumable = require("resumablejs");
//// TODO: Move Resumable into next/dynamic (I currently have no idea how to do this and my best guess didn't work)
// TODO: Drag-and-drop support
import plupload from "plupload";
function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + " " + units[u];
}
class VideoUpload extends Component {
  fileAdded(uploaderInstance, event) {
    console.log();
    this.setState({
      fileName: event[0].name,
      fileSize: event[0].size,
    });
  }


  constructor(props) {
    super(props);
    const { videoJSON } = props;
    this.videoID = videoJSON.id;
    this.token = null;
    this.fileAdded = this.fileAdded.bind(this);
    this.uploadProgress = this.uploadProgress.bind(this);
    this.uploadComplete = props.onUploadComplete;
    this.state = {
      fileName: null,
      fileSize: null,
      uploadProgressPercent: null,
      uploadProgressBytes: 0,
    };
  }

  uploadProgress(up, event) {
    this.setState({
      uploadProgressPercent: event.percent,
      uploadProgressBytes: event.loaded,
    });
  }

  uploadError(file, message) {
    console.log(message);
  }

  async componentDidMount() {
    const { token } = this.context;

    console.log("token:", token);
    // TODO: Error handling
    this.token = await getUploadToken(this.videoID, token);
    console.log(this.token)
    this.uploader = new plupload.Uploader({
      runtimes: "html5" ,
      browse_button: document.getElementById('browseButton'),
      chunk_size: "1m",
      url: this.token["uploadUrl"],
      multi_selection: false,
      multipart_params: {
        upload_token: this.token["uploadToken"],
        video_id: this.videoID,
      },
      init: {
        FilesAdded: this.fileAdded,
        UploadProgress: this.uploadProgress,
        UploadComplete: this.uploadComplete,
      },
    });
    this.uploader.init();

  }

  fileUploader = () => {
    return (
      <div className={styles.fileUploadContainer}>
        <Container className={styles.fileUupload}>
          <Row>
            <Col>
              <div>Filnavn: {this.state.fileName}</div>
              <div>
                Lastet opp: {humanFileSize(this.state.uploadProgressBytes)} / {humanFileSize(this.state.fileSize)}
              </div>
              <Button id="browseButton" style={{display: 'none'}}/>
              <Button id="uploadStartButton" onClick={() => this.uploader.start()}>
                Start
              </Button>
              <ProgressBar animated now={this.state.uploadProgressPercent} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  fileSelector = () => (
    <div className={styles.fileSelectorContainer}>
      <Container className={styles.fileSelector} fluid>
        <Row>
          <Col>
            <h2>Videofil ikke lastet opp</h2>
            <p>Vennligst last opp en fil</p>
            <Button id="browseButton">
              Velg fil...
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );

  render() {
    if (this.state.fileName) {
      return (
          <Container fluid>
            <Row>
              <Col>{this.fileUploader()}</Col>
            </Row>
          </Container>
      );
    } else {
      return (
          <Container fluid>
            <Row>
              <Col>{this.fileSelector()}</Col>
            </Row>
          </Container>
      );
    }

  }
}
VideoUpload.contextType = UserContext;

export default VideoUpload;
