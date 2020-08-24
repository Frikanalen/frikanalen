import { useState } from "react";
import { useRouter } from "next/router";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

import VideoCreate from "../../components/VideoCreate";

export default function AddVideo() {
  const router = useRouter();

  return (
    <Layout>
      <WindowWidget>
        <VideoCreate
          onVideoCreated={(videoID) => {
            router.push("/v/[id]", "/v/" + videoID);
          }}
        />
      </WindowWidget>
    </Layout>
  );
}
