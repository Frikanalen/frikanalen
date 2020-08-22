import { useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

import dynamic from "next/dynamic";

import VideoCreate from "../../components/VideoCreate";
const VideoUpload = dynamic(() => import("../../components/VideoUpload"), {
  ssr: false,
});

export default function AddVideo() {
  const [videoID, setVideoID] = useState(null);
  return (
    <Layout>
      <WindowWidget>
        {videoID ? (
          <VideoUpload videoID={videoID} />
        ) : (
          <VideoCreate onVideoCreated={setVideoID} />
        )}
      </WindowWidget>
    </Layout>
  );
}
