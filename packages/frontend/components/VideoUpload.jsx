import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import { getUploadToken } from "./API/Video";

import { UserContext } from "./UserContext";


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

  startUpload() {
    console.log("beginning upload");
    this.uploader.setOption("multipart_params", {
      upload_token: this.token["upload_token"],
      video_id: this.videoID,
    });
    this.uploader.start();
  }

  constructor(props) {
    super(props);
    this.browseRef = React.createRef();
    this.videoID = props.videoID;
    this.token = null;
    this.fileAdded = this.fileAdded.bind(this);
    this.uploadProgress = this.uploadProgress.bind(this);
    this.startUpload = this.startUpload.bind(this);
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

    console.log("token:", token)
    // TODO: Error handling
    this.token = await getUploadToken(this.videoID, token);
    this.uploader = new plupload.Uploader({
      runtimes: "html5",
      browse_button: this.browseRef.current,
      chunk_size: "1m",
      url: this.token["upload_url"],
      multi_selection: false,
      init: {
        FilesAdded: this.fileAdded,
        UploadProgress: this.uploadProgress,
        UploadComplete: this.uploadComplete,
      },
    });
    this.uploader.init();
    //this.r = new Resumable({
    //  target: token["upload_url"],
    //  query: { upload_token: token["upload_token"] },
    //  testMethod: "HEAD",
    //});
    //this.r.on("FileAdded", this.fileAdded);
    //this.r.on("FileError", this.uploadError);
    //this.r.assignBrowse(this.browseRef.current);
  }

  fileUploader = () => {
    return (
      <div className="file-upload-container">
        <Container className="file-upload">
          <Row>
            <Col>
              <div>Filnavn: {this.state.fileName}</div>
              <div>
                Lastet opp: {humanFileSize(this.state.uploadProgressBytes)} / {humanFileSize(this.state.fileSize)}
              </div>
              <Button onClick={this.startUpload}>Start</Button>
              <ProgressBar animated now={this.state.uploadProgressPercent} />
            </Col>
          </Row>
        </Container>
        <style jsx global>{`
          .file-upload-container {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
          }
          .file-upload {
            padding: 15px;
            color: black;
          }
        `}</style>
      </div>
    );
  };

  fileSelector = () => (
    <div className="file-selector-container">
      <Container className={"file-selector"} fluid>
        <Row>
          <Col>
            <Button ref={this.browseRef}>Velg fil...</Button>
          </Col>
        </Row>
      </Container>
      <style jsx global>{`
        .file-selector-container {
          background-color: white;
          padding: 15px;
          border-radius: 5px;
        }
        .file-selector {
          padding: 15px;
          color: black;
          border: 5px dashed #ccc;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );

  render() {
    return (
      <Container fluid>
        <Row>
          <Col>{this.state.fileName ? this.fileUploader() : this.fileSelector()}</Col>
        </Row>
      </Container>
    );
  }
}
VideoUpload.contextType = UserContext;

export default VideoUpload;
