import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import configs from "../../components/configs";
import Layout from "../../components/Layout";
import WindowWidget from "../../components/WindowWidget";

import { APIGET } from "../../components/API/Fetch";

function OrganizationData(props) {
  const [org, setOrg] = useState();

  useEffect(() => {
    async function fetchOrg(id) {
      return await APIGET(`organization/${id}`);
    }

    if (typeof props.orgID !== "undefined") {
      fetchOrg(props.orgID).then((o) => setOrg(o));
    }

    console.log(props.orgID);
  }, [props.orgID, setOrg, fetch]);

  if (org) {
    console.log(org);
    return (
      <div>
        <h1>{org.name}</h1>
      </div>
    );
  }
  return <Spinner />;
}

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
