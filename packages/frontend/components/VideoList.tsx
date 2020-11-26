import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import configs from "./configs";
import Link from "next/link";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/nb";

interface VideoJSON {
  description: string;
  name: string;
  id: number;
  large_thumbnail_url: string;
  created_time: string;
}

interface VideoQueryJSON {
  count: number;
  results: VideoJSON[];
}

export async function getLatestVideos(orgID: number) {
  const response = await fetch(`${configs.api}videos/?organization=${orgID}&page_size=10`);
  const latestVideos = await response.json();
  return latestVideos;
}

const VideoList: React.FC<{ videosJSON: VideoQueryJSON }> = ({ videosJSON }) => {
  const VideoCard: React.FC<{ v: VideoJSON }> = ({ v }) => (
    <Card key={v.id} style={{ minWidth: "18rem", minHeight: "100%", marginBottom: "15px" }}>
      <Link href={`/v/${v.id}`}>
        <Card.Img
          style={{ cursor: "pointer", objectFit: "contain", height: "140.625px", background: "black" }}
          variant="top"
          src={v.large_thumbnail_url}
        />
      </Link>
      <Card.Body>
        <Link href={`/v/${v.id}`}>{v.name}</Link>
      </Card.Body>
      <Card.Footer>
        Lastet opp{" "}
        <Moment locale="nb" format="Do MMMM YYYY">
          {v.created_time}
        </Moment>
      </Card.Footer>
    </Card>
  );
  if (videosJSON.count) {
    return (
      <CardDeck style={{ marginBottom: "10px", overflowX: "scroll", flexWrap: "nowrap" }}>
        {videosJSON.results.map((v) => VideoCard({ v }))}
      </CardDeck>
    );
  } else {
    return (
      <Card body style={{ marginBottom: "10px" }} className={"text-dark"}>
        Ingen videoer!
        <br />
      </Card>
    );
  }
};

export default VideoList;
