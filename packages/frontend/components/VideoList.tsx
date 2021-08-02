import React from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Link from "next/link";
import Moment from "react-moment";
import "moment/locale/nb";
import { APIGET, fkOrg, fkVideo, fkVideoQuery, fkVideoQuerySchema } from "./TS-API/API";

export async function getLatestVideos(organization: number | fkOrg): Promise<fkVideoQuery> {
  let orgID: number;

  if (typeof organization === "number") {
    orgID = organization;
  } else {
    orgID = organization.id;
  }

  return APIGET<fkVideoQuery>({
    endpoint: `videos/?organization=${orgID}&page_size=10`,
    validator: fkVideoQuerySchema.parse,
  });
}

interface VideoComponent {
  video: fkVideo;
}

const VideoCard = ({ video }: VideoComponent): JSX.Element => (
  <Card key={video.id} style={{ minWidth: "18rem", minHeight: "100%", marginBottom: "15px" }}>
    <Link href={`/video/${video.id}`} as={`/video/${video.id}`}>
      <Card.Img
        style={{ cursor: "pointer", objectFit: "contain", height: "140.625px", background: "black" }}
        variant="top"
        src={video.files.largeThumb}
      />
    </Link>
    <Card.Body>
      <Link href={`/video/${video.id}`} as={`/video/${video.id}`}>
        {video.name}
      </Link>
    </Card.Body>
    <Card.Footer>
      Lastet opp{" "}
      <Moment locale="nb" format="Do MMMM YYYY">
        {video.createdTime || ""}
      </Moment>
    </Card.Footer>
  </Card>
);

interface VideoListProps {
  videosJSON: fkVideoQuery;
}

const VideoList = ({ videosJSON }: VideoListProps): JSX.Element => {
  if (videosJSON.count)
    return (
      <CardDeck style={{ marginBottom: "10px", overflowX: "scroll", flexWrap: "nowrap" }}>
        {videosJSON.results.map((video) => VideoCard({ video }))}
      </CardDeck>
    );

  return (
    <Card body style={{ marginBottom: "10px" }} className="text-dark">
      Ingen videoer!
      <br />
    </Card>
  );
};

export default VideoList;
