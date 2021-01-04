import React, { useState } from "react";
import { fkVideo } from "./TS-API/API";
import Spinner from "react-bootstrap/Spinner";
import dynamic from "next/dynamic";
const VideoUpload = dynamic(() => import("./VideoUpload"), {
  ssr: false,
});

export const VideoPlayer = ({ video }: VideoWidgetProps) => {
  return (
    <div className="videoPlayer">
      <video poster={video.files.largeThumb} controls>
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

export interface VideoWidgetProps {
  video: fkVideo;
}

export const VideoSpinner = () => {
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

export const VideoWidget: React.FunctionComponent<VideoWidgetProps> = ({ video }) => {
  const [videoState, setVideoState] = useState<string>("");

  if (typeof video?.files == "object" && Object.keys(video.files).length) {
    if ("theora" in video.files) {
      return <VideoPlayer video={video} />;
    } else if ("original" in video.files || "broadcast" in video.files) {
      return <VideoSpinner />;
    }
  } else {
    if (video) {
      return <VideoUpload videoJSON={video} onUploadComplete={() => setVideoState("pending")} />; // className={styles.videoUploadBox}
    }
  }

  return null;
};

export default VideoWidget;
