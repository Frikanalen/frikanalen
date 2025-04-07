import React from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

export const VideoPlayer = () => (
  <div className={"aspect-video"}>
    <MediaPlayer
      title="Frikanalen direkte"
      src="https://frikanalen.no/stream/index.m3u8"
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  </div>
);

export default VideoPlayer;
