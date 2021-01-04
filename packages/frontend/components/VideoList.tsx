import React from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Link from "next/link";
import Moment from "react-moment";
import "moment/locale/nb";
import { APIGET, fkVideo, fkVideoQuery, fkVideoQuerySchema } from "./TS-API/API";

export async function getLatestVideos(orgID: number): Promise<fkVideoQuery> {
  return await APIGET<fkVideoQuery>({
    endpoint: `videos/?organization=${orgID}&page_size=10`,
    validator: fkVideoQuerySchema.parse,
  });
}

const VideoList: React.FC<{ videosJSON: fkVideoQuery }> = ({ videosJSON }) => {
  const VideoCard: React.FC<{ v: fkVideo }> = ({ v }) => (
    <Card key={v.id} style={{ minWidth: "18rem", minHeight: "100%", marginBottom: "15px" }}>
      <Link href={`/video/${v.id}`}>
        <Card.Img
          style={{ cursor: "pointer", objectFit: "contain", height: "140.625px", background: "black" }}
          variant="top"
          src={v.largeThumbnailUrl}
        />
      </Link>
      <Card.Body>
        <Link href={`/video/${v.id}`}>{v.name}</Link>
      </Card.Body>
      <Card.Footer>
        Lastet opp{" "}
        <Moment locale="nb" format="Do MMMM YYYY">
          {v.createdTime || ""}
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
