import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import configs from "./configs";
import Link from "next/link";

export async function getLatestVideos(orgID: number) {
  const response = await fetch(`${configs.api}videos/?organization=${orgID}&page_size=10`);
  const latestVideos = await response.json();
  return latestVideos;
}

const VideoList: React.FC<{ videoList: VideoQueryJSON }> = ({ videoList }) => {
  const VideoCards: React.FC<{ videosJSON: VideoQueryJSON }> = ({ videosJSON }) => {
    if (typeof videosJSON === "undefined") return null;

    const VideoCard: React.FC<{ v: VideoJSON }> = ({ v }) => (
      <Card style={{ minWidth: "18rem", minHeight: "100%", marginBottom: "15px" }}>
        <Card.Img
          style={{ objectFit: "contain", height: "140.625px", background: "black" }}
          variant="top"
          src={v.large_thumbnail_url}
        />
        <Card.Body>
          <Link href={`/v/${v.id}`}>{v.name}</Link>
        </Card.Body>
        <Card.Footer>Lastet opp på (...)</Card.Footer>
      </Card>
    );
    return <React.Fragment>{videosJSON.results.map((v) => VideoCard({ v }))}</React.Fragment>;
  };

  return (
    <CardDeck style={{ overflowX: "scroll", flexWrap: "nowrap" }}>
      <VideoCards videosJSON={videoList} />
    </CardDeck>
  );
};

export default VideoList;
