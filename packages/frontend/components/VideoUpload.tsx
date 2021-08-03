import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import { Upload } from "tus-js-client";
import bsCustomFileInput from "bs-custom-file-input";

import { fkVideo, getUploadToken } from "./TS-API/API";
import {UserContext, UserContextLoggedInState, UserContextState} from "./UserContext";
import styles from "./VideoUpload.module.sass";

function humanFileSize(sizeBytes: number, si = true, dp = 1): string {
  let bytes = sizeBytes;
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    u += 1;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return `${bytes.toFixed(dp)} ${units[u]}`;
}

const errorMessage = (error: string): JSX.Element => (
  <div>
    <h2>Beklager!</h2>
    <p>Det har oppstått en feil. Vennligst ta kontakt med oss, og vis denne meldingen:</p>
    <code>{error}</code>
  </div>
);

type VideoUploadProps = {
  videoJSON: fkVideo;
  onUploadComplete: () => void;
};

type VideoUploadState = {
  uploadToken: string | null;
  uploadedBytes: number;
  totalBytes: number;
  file: File | null;
  error: string | null;
  status: string | null;
};

class VideoUpload extends Component<VideoUploadProps, VideoUploadState> {
  static contextType = UserContext;

  private readonly uploadComplete: () => void;

  private readonly videoID: number;

  constructor(props: VideoUploadProps) {
    super(props);

    const { videoJSON, onUploadComplete } = props;
    this.videoID = videoJSON.id;

    this.startUpload = this.startUpload.bind(this);
    this.uploadComplete = onUploadComplete;

    this.state = {
      uploadToken: null,
      uploadedBytes: 0,
      totalBytes: 0,
      file: null,
      error: null,
      status: null,
    };
  }

  async componentDidMount(): Promise<void> {
    const { isLoggedIn } = this.context as UserContextState;
    if (!isLoggedIn) throw new Error("A user who isn't logged in should never see this");

    const { token } = this.context as UserContextLoggedInState;

    const uploadToken = await getUploadToken(this.videoID, token);

    this.setState({ uploadToken: uploadToken.uploadToken });

    bsCustomFileInput.init();
  }

  startUpload = (): void => {
    const { uploadToken, file } = this.state;

    if (!file) return;

    if (!uploadToken) {
      throw new Error("Cannot upload without upload token!");
    }

    const upload = new Upload(file, {
      endpoint: "https://frikanalen.no/api/videos/upload/",
      retryDelays: [0, 1000], // , 3000, 5000],
      metadata: {
        origFileName: file.name,
        videoID: `${this.videoID}`,
        uploadToken,
      },
      onError: (error): void => {
        console.log(error);
        this.setState({
          error: `upload failed:\n${error.message}`,
        });
      },
      onProgress: (uploadedBytes, totalBytes): void => {
        this.setState({
          totalBytes,
          uploadedBytes,
        });
      },
      onSuccess: (): void => this.uploadComplete()
    });

    upload.start();

    this.setState({
      status: null,
      uploadedBytes: 0,
      totalBytes: 0,
    });
  };

  fileUploader = (): JSX.Element => {
    const { error, status, uploadedBytes, totalBytes, file } = this.state;

    const uploadButton = (): JSX.Element => (
      <div>
        {error ? errorMessage(error) : null}
        <div>{status}</div>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ flexGrow: 1 }}>
            Lastet opp: {humanFileSize(uploadedBytes)} / {humanFileSize(totalBytes)}
          </div>
          <div>
            <Button id="uploadStartButton" onClick={(): void => this.startUpload()}>
              Start
            </Button>
          </div>
        </div>
        <ProgressBar animated now={100 * (uploadedBytes / totalBytes)} />
      </div>
    );
    return (
      <div className={styles.fileUploadContainer}>
        <Container className={styles.fileUpload}>
          <Row>
            <Col>
              <h2>Videofil ikke lastet opp</h2>
              <div className="custom-file">
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Vennligst velg en fil...
                  <input
                    id="inputGroupFile01"
                    type="file"
                    className="custom-file-input"
                    onChange={(event): void => {
                      if (event.target.files?.[0]) {
                        this.setState({
                          file: event.target.files[0],
                          totalBytes: event.target.files[0].size,
                        });
                      }
                    }}
                  />
                </label>
              </div>
              {file ? uploadButton() : null}
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  render(): JSX.Element {
    return (
      <Container fluid>
        <Row>
          <Col>{this.fileUploader()}</Col>
        </Row>
      </Container>
    );
  }
}

export default VideoUpload;
