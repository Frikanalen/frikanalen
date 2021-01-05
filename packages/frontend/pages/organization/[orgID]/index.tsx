import React from "react";
import Layout from "components/Layout";
import WindowWidget from "components/WindowWidget";
import { getOrg, fkOrg } from "components/TS-API/API";
import VideoList, { getLatestVideos } from "components/VideoList";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context.query.orgID != "string" || isNaN(parseInt(context.query.orgID))) {
    throw new Error(`Invalid organization ID "${context.query.orgID}"`);
  }

  const orgID = parseInt(context.query.orgID);

  const orgData = await getOrg(orgID);
  const latestVideos = await getLatestVideos(orgID);

  return {
    props: {
      orgData,
      latestVideos,
    },
  };
};

function OrganizationData(props: { orgData: fkOrg }) {
  const { orgData } = props;
  return (
    <div>
      <h1>{orgData.name}</h1>
      <p style={{ whiteSpace: "pre-line" }}>{orgData.description}</p>
    </div>
  );
}

function OrganizationContactInfo(props: { orgData: fkOrg }) {
  const { orgData } = props;

  return (
    <CardDeck>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Redaktør</Card.Title>
          <p>
            {orgData.editorName}
            <br />
            <a href={`mailto:${orgData.editorEmail}`}>{orgData.editorEmail}</a>
            <br />
            <a href={`tel:${orgData.editorMsisdn}`}>{orgData.editorMsisdn}</a>
          </p>
        </Card.Body>
      </Card>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Postadresse</Card.Title>
          <p style={{ whiteSpace: "pre" }}>{orgData.postalAddress}</p>
        </Card.Body>
      </Card>
      <Card bg="light" className="text-dark">
        <Card.Body>
          <Card.Title>Besøksadresse</Card.Title>
          <p style={{ whiteSpace: "pre" }}>{orgData.streetAddress}</p>
        </Card.Body>
      </Card>
    </CardDeck>
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
            <VideoList videosJSON={latestVideos} />
          </Card.Body>
        </Card>
        <p>&nbsp;</p>
        <OrganizationContactInfo orgData={orgData} />
      </WindowWidget>
    </Layout>
  );
}
