import React, { Component } from "react";
import { useRouter } from "next/router";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Layout from "../../../components/Layout";
import WindowWidget from "../../../components/WindowWidget";

import config from "../../../components/configs";
import Video, { getCategories } from "../../../components/API/Video";
import ProfileFetcher from "../../../components/API/User";

interface fkOrganizationJSON {
  id: number;
  name: string;
}

const getOrgName = async (orgID: number): string => {
  const res = await fetch(`${config.api}organization/${orgID}`);
  console.log(`${config.api}organization/${orgID}`);
  const resData: fkOrganizationJSON = await res.json();
  return resData.name;
};

class VideoCreate extends Component {
  constructor(props) {
    super(props);
    const { orgID, orgName } = props;

    this.onVideoCreated = props.onVideoCreated;
    this.state = {
      errors: null,
      video: new Video(),
      possibleCategories: [],
      uploadingOrgID: orgID,
      uploadingOrgName: orgName,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { video, uploadingOrgID } = this.state;
    console.log(typeof uploadingOrgID);

    getCategories().then((categories) => {
      this.setState({ possibleCategories: categories });
    });
    ProfileFetcher().then((userProfile) => {
      video.setOrganization(uploadingOrgID);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.video
      .save()
      .catch((e) => {
        if (e.response.status == 400) {
          var errors = [];
          for (const key in e.response.data) {
            errors.push(
              <Alert variant="danger">
                <Alert.Heading>{key}</Alert.Heading>
              </Alert>
            );
          }
          this.setState({ errors: errors });
        } else {
          console.log(e.response.status);
          console.log(e.response.data);
        }
      })
      .then((r) => {
        this.onVideoCreated(this.state.video.ID);
      });
  }

  render() {
    const { uploadingOrgName } = this.state;
    return (
      <div>
        <Form>
          {this.state.errors}
          <Form.Group>
            <Form.Label>På vegne av:</Form.Label>
            <Form.Control readOnly value={uploadingOrgName ? uploadingOrgName : "Laster organisasjon..."} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Navn:</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => this.state.video.setName(event.target.value)}
              value={this.state.video.name}
              placeholder="Kort videonavn"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ingress:</Form.Label>
            <Form.Control
              type="text"
              value={this.state.video.header}
              onChange={(e) => this.state.video.setHeader(event.target.value)}
              placeholder="En relativt kortfattet beskrivelse"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Kategori:</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => {
                var selectedCategories = [];
                for (let i = 0; i < e.target.selectedOptions.length; i++) {
                  selectedCategories.push(e.target.selectedOptions[i].value);
                }
                this.state.video.setCategories(selectedCategories);
              }}
              multiple
            >
              {this.state.possibleCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button onClick={this.handleSubmit} variant="primary" type="submit">
            Start
          </Button>
        </Form>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const orgName = await getOrgName(id);

  return {
    props: { orgName },
  };
}

export default function AddVideo(props) {
  const router = useRouter();
  const { id } = router.query;
  const orgID = parseInt(id);
  const { orgName } = props;

  return (
    <Layout>
      <WindowWidget>
        <VideoCreate
          orgID={orgID}
          orgName={orgName}
          onVideoCreated={(videoID) => {
            router.push("/v/[id]", `/v/${videoID}`);
          }}
        />
      </WindowWidget>
    </Layout>
  );
}
