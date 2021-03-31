import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import { getUploadToken } from "./TS-API/API";
import bsCustomFileInput from 'bs-custom-file-input'

import { UserContext } from "./UserContext";
import styles from "./VideoUpload.module.sass";
import { Upload } from 'tus-js-client';

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
  constructor(props) {
    super(props);

    const {videoJSON} = props;
    this.videoID = videoJSON.id;

    this.startUpload = this.startUpload.bind(this)
    this.uploadComplete = props.onUploadComplete;

    this.state = {
      uploadToken: null,
      uploadedBytes: 0,
      totalBytes: 0,
      file: null,
      error: null,
      status: null,
      uploadUrl: null,
    }
  }

  async componentDidMount() {
    const {token} = this.context;
    getUploadToken(this.videoID, token).then(uploadToken => {
      this.setState({uploadToken: uploadToken.uploadToken})
    });
    bsCustomFileInput.init()
  }

  startUpload() {
    const {file} = this.state

    if (!file) return

    const upload = new Upload(file, {
      endpoint: 'https://frikanalen.no/api/videos/upload/',
      retryDelays: [0, 1000], //, 3000, 5000],
      metadata: {
        origFileName: this.state.file.name,
        videoID: this.videoID,
        uploadToken: this.state.uploadToken,
      },
      onError: (error) => {
        console.log(error)
        this.setState({
          error: `upload failed:\n${error}`,
        })
      },
      onProgress: (uploadedBytes, totalBytes) => {
        this.setState({
          totalBytes,
          uploadedBytes,
        })
      },
      onSuccess: () => {
        console.log("huzzah")
        this.uploadComplete();},
    })

    upload.start()

    this.setState({
      status: null,
      uploadedBytes: 0,
      totalBytes: 0,
      uploadUrl: null,
    })
  }

  uploadError(file, message) {
    console.log(message);
  }

  fileUploader = () => {
    const errorField = () => (
        <div>
          <h2>Beklager!</h2>
          <p>Det har oppstått en feil. Vennligst ta kontakt med oss, og vis denne meldingen:</p>
          <code>
            {this.state.error}
          </code>
        </div>
    )

    const uploadButton = () => {
      return (
          <div>
            {this.state.error ? errorField() : null}
            <div>
              {this.state.status}
            </div>
            <div style={{display: 'flex', alignItems: 'baseline'}}>
              <div style={{flexGrow: '1', }}>
                Lastet opp: {humanFileSize(this.state.uploadedBytes)} / {humanFileSize(this.state.totalBytes)}
              </div>
              <div>
                <Button id="uploadStartButton" onClick={() => this.startUpload()}>
                  Start
                </Button>
              </div>
            </div>
            <ProgressBar animated now={100 * (this.state.uploadedBytes * 1.0 / this.state.totalBytes)}/>
          </div>
      )
    }
    return (
        <div className={styles.fileUploadContainer}>
          <Container className={styles.fileUupload}>
            <Row>
              <Col>
                <h2>Videofil ikke lastet opp</h2>
                <div className={"custom-file"}>
                  <input id="inputGroupFile01" type="file" className="custom-file-input"
                         onChange={event => {
                           this.setState(
                               {
                                 file: event.target.files[0],
                                 totalBytes: event.target.files[0].size
                               }
                               )
                         }}
                  />
                  <label className="custom-file-label" htmlFor="inputGroupFile01">Vennligst velg en fil...</label>
                </div>
                {this.state.file ? uploadButton() : null}
              </Col>
            </Row>
          </Container>
        </div>
    );
  };

  render() {
    return (
        <Container fluid>
          <Row>
            <Col>{this.fileUploader()}</Col>
          </Row>
        </Container>
    )
  }
}
VideoUpload.contextType = UserContext;

export default VideoUpload;
