import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import configs from "../../../components/configs";
import WindowWidget from "../../../components/WindowWidget";
import config from "../../../components/configs";

interface VideoJSON {
  description: string;
  name: string;
  id: number;
  large_thumbnail_url: string;
}

interface VideoQueryJSON {
  count: number;
  results: VideoJSON[];
}

interface fkOrganizationJSON {
  id: number;
  name: string;
}

async function getLatestVideos(orgID: number): Promise<VideoQueryJSON> {
  console.log(`OrgID: ${orgID}`);
  if (typeof orgID === "undefined") return undefined;
  const response = await fetch(`${configs.api}videos/?organization=${orgID}&page_size=10`);
  const json = response.json();
  return json;
}

const VideoList: React.FC<{ orgID: number }> = ({ orgID }) => {
  let [latestVideosJSON, setLatestVideosJSON] = useState<VideoQueryJSON>(undefined);

  useEffect(() => {
    if (typeof orgID === "undefined") return;
    getLatestVideos(orgID).then((json) => {
      setLatestVideosJSON(json);
    });
  }, [orgID]);

  const VideoCards: React.FC<{ videosJSON: VideoQueryJSON }> = ({ videosJSON }) => {
    console.log(`VideosCards`, videosJSON);
    if (typeof videosJSON === "undefined") return null;

    const VideoCard: React.FC<{ v: VideoJSON }> = ({ v }) => {
      console.log(`VideosCard`, v);

      return (
        <Card style={{ minWidth: "18rem", minHeight: "100%" }}>
          <Card.Img style={{ width: "100%", height: "auto" }} variant="top" src={v.large_thumbnail_url} />
          <Card.Title>{v.name}</Card.Title>
          <Card.Footer>Lastet opp på (...)</Card.Footer>
        </Card>
      );
    };

    return <React.Fragment>{videosJSON.results.map((v) => VideoCard({ v }))}</React.Fragment>;
  };

  return (
    <Card bg="light" className="text-dark">
      <Card.Title>Siste videoer</Card.Title>
      <Card.Body>
        <CardDeck style={{ overflowX: "scroll", flexWrap: "nowrap" }}>
          <VideoCards videosJSON={latestVideosJSON} />
        </CardDeck>
      </Card.Body>
    </Card>
  );
};

const getOrgName = async (orgID: number): Promise<string> => {
  const res = await fetch(`${config.api}organization/${orgID}`);
  console.log(`${config.api}organization/${orgID}`);
  const resData: fkOrganizationJSON = await res.json();
  return resData.name;
};
export default function OrgAdmin(props) {
  const router = useRouter();
  const { orgName, orgID } = props;

  return (
    <Layout>
      <WindowWidget>
        <h3>{orgName}</h3>
        <VideoList orgID={orgID} />
        <Card body>
          <Button href="ny-video">Last opp ny video...</Button>
        </Card>
      </WindowWidget>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const orgID = parseInt(id);
  const orgName = await getOrgName(id);

  return {
    props: {
      orgName,
      orgID,
    },
  };
}
