import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import WindowWidget from "../../../components/WindowWidget";

import VideoList, { getLatestVideos } from "components/VideoList";
import { APIGET, fkOrg, fkOrgSchema, fkVideoQuery } from "components/TS-API/API";
import { GetServerSideProps } from "next";

interface OrgAdminProps {
  orgName: string;
  orgID: number;
  latestVideos: fkVideoQuery;
}

export default function OrgAdmin({ orgName, orgID, latestVideos }: OrgAdminProps) {
  const router = useRouter();

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context.query.orgID != "string" || isNaN(parseInt(context.query.orgID))) {
    throw new Error(`Invalid organization ID "${context.query.orgID}"`);
  }
  const orgID = parseInt(context.query.orgID);
  const { name } = await APIGET<fkOrg>({
    endpoint: `organization/${orgID}`,
    validator: fkOrgSchema.parse,
  });

  const latestVideos = await getLatestVideos(orgID);

  return {
    props: {
      organizationName: name,
      orgID: orgID,
      latestVideos,
    },
  };
};
