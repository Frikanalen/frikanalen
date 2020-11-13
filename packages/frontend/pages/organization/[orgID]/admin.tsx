import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import WindowWidget from "../../../components/WindowWidget";
import config from "../../../components/configs";

import VideoList, { getLatestVideos } from "components/VideoList";

interface fkOrganizationJSON {
  id: number;
  name: string;
}

const getOrgName = async (orgID: number): Promise<string> => {
  const res = await fetch(`${config.api}organization/${orgID}`);
  console.log(`${config.api}organization/${orgID}`);
  const resData: fkOrganizationJSON = await res.json();
  return resData.name;
};
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
            <VideoList videoList={latestVideos} />
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
  const { id } = context.query;
  const orgID = parseInt(id);
  const orgName = await getOrgName(id);
  const latestVideos = await getLatestVideos(orgID);

  return {
    props: {
      orgName,
      orgID,
      latestVideos,
    },
  };
}
