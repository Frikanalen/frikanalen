import Alert from "react-bootstrap/Alert";
import configs from "components/configs";

import React from "react";
import PropTypes from "prop-types";
import Layout from "components/Layout";
import WindowWidget from "components/WindowWidget";
import { fkOrg } from "components/TS-API/API";
import VideoList, { getLatestVideos } from "components/VideoList";
import Card from "react-bootstrap/Card";

export async function getServerSideProps(context: any) {
  const { orgID } = context.query;
  const orgJSON = await fetch(`${configs.api}organization/${orgID}`);
  const orgData = await orgJSON.json();
  const latestVideos = await getLatestVideos(orgID);

  return {
    props: {
      orgData,
      latestVideos,
    },
  };
}

function OrganizationData(props) {
  const { orgData } = props;
  return (
    <div>
      <h1>{orgData.name}</h1>
    </div>
  );
}

export default function OrganizationPage(props: { orgData: fkOrg; latestVideos: any }) {
  const { orgData, latestVideos } = props;

  return (
    <Layout>
      <WindowWidget>
        <OrganizationData orgData={orgData} />
        <Card bg="light" className="text-dark">
          <Card.Body>
            <Card.Title>Siste videoer</Card.Title>
            <VideoList videoList={latestVideos} />
          </Card.Body>
        </Card>
        <p>&nbsp;</p>
        <Alert variant="info">
          <Alert.Heading>Denne siden er fremdeles under utbygging</Alert.Heading>
          <p>Frikanalens nettsider er i aktiv utvikling.</p>
          <p>Vi håper å ha en mer fullstendig side på plass innen kort tid.</p>
          <p>Takk for forståelsen!</p>
        </Alert>
      </WindowWidget>
    </Layout>
  );
}
