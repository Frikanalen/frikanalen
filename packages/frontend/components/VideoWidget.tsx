import React, { useEffect, useState } from "react";
import { APIGET, fkVideo, fkVideoSchema } from "./TS-API/API";
import Spinner from "react-bootstrap/Spinner";
import dynamic from "next/dynamic";
import { Stream } from "@cloudflare/stream-react";

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
        <Spinner animation="border" />
      </div>
      <style jsx>{`
        .videoSpinner {
          width: 100%;
          height: 100%;
          display: flex;
          padding: 20px;
          justify-items: center;
          align-items: center;
          font-family: Roboto;
          background: white;
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
  const [videoJSON, setVideoJSON] = useState<fkVideo>(video);
  useEffect(() => {
    const checkProgress = () => {
      APIGET<fkVideo>({
        endpoint: `videos/${video.id}`,
        validator: fkVideoSchema.parse,
      }).then((video) => {
        setVideoJSON(video);
        if ("cloudflareId" in video.files || "theora" in video.files) {
          setVideoState("");
        } else {
          setTimeout(checkProgress, 1000);
        }
      });
    };

    setTimeout(() => {
      if (videoState == "pending") {
        setTimeout(checkProgress, 1000);
      }
    }, 1000);
  }, [videoState]);

  if (videoState == "pending") {
    return <VideoSpinner />;
  }

  if (typeof videoJSON?.files == "object" && Object.keys(videoJSON.files).length) {
    if ("cloudflareId" in videoJSON.files) {
      return <Stream controls src={videoJSON.files.cloudflareId || ""} />;
    } else if ("theora" in videoJSON.files) {
      return <VideoPlayer video={videoJSON} />;
    } else if ("original" in videoJSON.files || "broadcast" in videoJSON.files) {
      setVideoState("pending");
    }
  } else {
    if (videoJSON) {
      return <VideoUpload videoJSON={videoJSON} onUploadComplete={() => setVideoState("pending")} />; // className={styles.videoJSONUploadBox}
    }
  }

  return null;
};

export default VideoWidget;
