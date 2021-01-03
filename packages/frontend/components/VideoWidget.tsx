import React, { useState } from "react";
import { APIGET, fkVideoJSON } from "./TS-API/API";
import Spinner from "react-bootstrap/Spinner";
import dynamic from "next/dynamic";
const VideoUpload = dynamic(() => import("./VideoUpload"), {
  ssr: false,
});

export interface VideoWidgetProps {
  video: fkVideoJSON;
}

export const VideoPlayer = ({ video }: VideoWidgetProps) => {
  return (
    <div className="videoPlayer">
      <video poster={video.files.large_thumb} controls>
        <source src={video.files.theora} type="video/ogg" />
      </video>
      <style jsx>{`
        .videoPlayer > video {
          width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export const VideoSpinner = (props: VideoWidgetProps) => {
  return (
    <div className="videoSpinner">
      <div className="processingMessage">
        <h2>Videoen blir behandlet</h2>
        <h3>Om denne meldingen vedvarer lenger enn fire timer, vennligst kontakt teknisk leder.</h3>
      </div>
      <Spinner animation="border" />
      <style jsx>{`
        .videoSpinner {
          width: 100%;
          height: 100%;
          display: flex;
          justify-items: center;
          align-items: center;
          font-family: Roboto;
        }
        .processingMessage {
          flex-grow: 1;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export const VideoWidget = ({ video }: VideoWidgetProps) => {
  const [videoState, setVideoState] = useState(null);

  if (video == undefined) return null;

  if (typeof video?.files == "object" && Object.keys(video.files).length) {
    if ("theora" in video.files) {
      return <VideoPlayer video={video} />;
    } else if ("original" in video.files || "broadcast" in video.files) {
      return <VideoSpinner video={video} />;
    }
  } else {
    return <VideoUpload videoJSON={video} onUploadComplete={() => setVideoState("pending")} />; // className={styles.videoUploadBox}
  }
};
