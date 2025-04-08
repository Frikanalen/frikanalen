import React from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "./videoplayer.css";

export const VideoPlayer = ({
  title,
  src,
  poster,
}: {
  title: string;
  src: string;
  poster?: string;
}) => (
  <MediaPlayer title={title} src={src} className={"!border-0 !rounded-xl"}>
    {poster && <Poster src={poster} />}
    <MediaProvider />
    <DefaultVideoLayout icons={defaultLayoutIcons} />
  </MediaPlayer>
);

export default VideoPlayer;
