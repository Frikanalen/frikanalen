import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

import { APIGET } from "../../components/API/Fetch";

function OrganizationData(props) {
  const [org, setOrg] = useState();
  const { orgID } = props;

  useEffect(() => {
    async function fetchOrg(id) {
      return APIGET(`organization/${id}`);
    }

    if (typeof orgID !== "undefined") {
      fetchOrg(orgID).then((o) => setOrg(o));
    }
  }, [orgID, setOrg, fetch]);

  if (org) {
    return (
      <div>
        <h1>{org.name}</h1>
      </div>
    );
  }
  return <Spinner />;
}

OrganizationData.propTypes = {
  orgID: PropTypes.number.isRequired,
};

export default function OrganizationPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <WindowWidget>
        <OrganizationData orgID={id} />
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
