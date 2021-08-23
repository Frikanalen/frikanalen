import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { GetServerSideProps } from "next";
import VideoList, { getLatestVideos } from "components/VideoList";
import { APIGET, fkOrg, fkOrgSchema, fkVideoQuery } from "components/TS-API/API";
import WindowWidget from "../../../components/WindowWidget";

interface OrgAdminProps {
  orgName: string;
  orgID: number;
  latestVideos: fkVideoQuery;
}

const OrgAdmin = ({ orgName, latestVideos }: OrgAdminProps): JSX.Element => (
  <>
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
  </>
);

export default OrgAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context.query.orgID !== "string" || Number.isNaN(parseInt(context.query.orgID, 10))) {
    throw new Error("Invalid organization ID");
  }
  const orgID = parseInt(context.query.orgID, 10);
  const { name } = await APIGET<fkOrg>({
    endpoint: `organization/${orgID}`,
    validator: fkOrgSchema.parse,
  });

  const latestVideos = await getLatestVideos(orgID);

  return {
    props: {
      organizationName: name,
      orgID,
      latestVideos,
    },
  };
};
