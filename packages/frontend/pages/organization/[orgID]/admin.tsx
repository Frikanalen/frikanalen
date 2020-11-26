import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import WindowWidget from "../../../components/WindowWidget";
import config from "../../../components/configs";

import VideoList, { getLatestVideos } from "components/VideoList";
import { APIGET, fkOrgJSON } from "components/TS-API/API";

export default function OrgAdmin(props) {
  const router = useRouter();
  const { orgName, orgID, latestVideos } = props;

  return (
    <Layout>
      <WindowWidget>
        <h3>{orgName}</h3>
        <Card bg="light" className="text-dark">
          <Card.Title>Siste videoer</Card.Title>
          <Card.Body>
            <VideoList videosJSON={latestVideos} />
          </Card.Body>
        </Card>
        <Card body>
          <Button href="ny-video">Last opp ny video...</Button>
        </Card>
      </WindowWidget>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const orgIDString = context.query.orgID;
  const orgID = parseInt(orgIDString);
  const { name } = await APIGET<fkOrgJSON>(`organization/${orgID}`);

  const latestVideos = await getLatestVideos(orgID);

  return {
    props: {
      orgName: name,
      orgID,
      latestVideos,
    },
  };
}
