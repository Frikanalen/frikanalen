import React from "react";
import { APIGET, fkVideoJSON } from "../../components/TS-API/API";

export interface VideoWidgetProps {
  fkVideoJSON: fkVideoJSON;
}

export const VideoPlayer = ({ fkVideoJSON }: VideoWidgetProps) => {
  return (
    <div className="videoPlayer">
      <video poster={fkVideoJSON.files.large_thumb} controls>
        <source src={fkVideoJSON.files.theora} type="video/ogg" />
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
export const VideoWidget = (props: VideoWidgetProps) => {
  return (
    <div className="videoWidget">
      <VideoPlayer {...props} />
      <style jsx>{``}</style>
    </div>
  );
};
