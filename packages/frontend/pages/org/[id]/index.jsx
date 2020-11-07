import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import configs from "../../../components/configs";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Layout from "../../../components/Layout";
import WindowWidget from "../../../components/WindowWidget";

import { APIGET } from "../../../components/API/Fetch";
export async function getServerSideProps (context) {

  const { id } = context.query;
  console.log(`${configs.api}organizations/${id}`)
  const orgJSON = await fetch(`${configs.api}organization/${id}`)
  const orgData = await orgJSON.json();

  return {
    props: {orgData},
  }

}

function OrganizationData(props) {
  const [org, setOrg] = useState();
  const { orgData } = props;
    return (
      <div>
        <h1>{orgData.name}</h1>
      </div>
    );
}

OrganizationData.propTypes = {
  orgID: PropTypes.number.isRequired,
};

export default function OrganizationPage(props) {
  const { orgData } = props

  return (
    <Layout>
      <WindowWidget>
        <OrganizationData orgData={orgData} />
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
