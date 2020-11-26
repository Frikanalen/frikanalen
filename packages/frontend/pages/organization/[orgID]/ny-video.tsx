import React, { Component } from "react";
import { useRouter } from "next/router";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Layout from "components/Layout";
import WindowWidget from "components/WindowWidget";

import config from "components/configs";
import Video, { getCategories } from "components/API/Video";
import ProfileFetcher from "components/API/User";
import { UserContext } from "../../../components/UserContext";

interface fkOrganizationJSON {
  id: number;
  name: string;
}

class VideoCreate extends Component<
  {
    orgID: number;
    orgName: string;
    onVideoCreated: any;
  },
  {
    video: Video;
    errors: any;
    possibleCategories: any;
    uploadingOrgID: number;
    uploadingOrgName: string;
  }
> {
  onVideoCreated;

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
    this.state.video.setOrganization(orgID);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { video, uploadingOrgID } = this.state;
    const { token } = this.context;

    const categories = await getCategories();
    this.setState({ possibleCategories: categories });
  }

  handleSubmit(event) {
    const { token } = this.context;
    event.preventDefault();
    this.state.video
      .save(token)
      .then((r) => {
        console.log("redirecting to ", this.state.video.ID);
        this.onVideoCreated(this.state.video.ID);
      })
      .catch((e) => {
        if (e.response.status == 400) {
          var errors = [];
          for (const key in e.response.data) {
            errors.push(
              <Alert key={key} variant="danger">
                <Alert.Heading>{key}</Alert.Heading>
              </Alert>
            );
          }
          this.setState({ errors: errors });
        } else {
          console.log(e.response.status);
          console.log(e.response.data);
        }
      });
  }

  render() {
    const { errors, uploadingOrgName } = this.state;
    return (
      <div>
        <Form>
          {errors}
          <Form.Group>
            <Form.Label>På vegne av:</Form.Label>
            <Form.Control readOnly value={uploadingOrgName ? uploadingOrgName : "Laster organisasjon..."} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Navn:</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => this.state.video.setName(e.target.value)}
              value={this.state.video.name}
              placeholder="Kort videonavn"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ingress:</Form.Label>
            <Form.Control
              type="text"
              value={this.state.video.header}
              onChange={(e) => this.state.video.setHeader(e.target.value)}
              placeholder="En relativt kortfattet beskrivelse"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Kategori:</Form.Label>
            <Form.Control
              as="select"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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

VideoCreate.contextType = UserContext;

export async function getServerSideProps(context) {
  const getOrgName = async (orgID: number): Promise<string> => {
    const res = await fetch(`${config.api}organization/${orgID}`);
    console.log(`${config.api}organization/${orgID}`);
    const resData: fkOrganizationJSON = await res.json();
    return resData.name;
  };

  const { orgID } = context.query;
  const orgName = await getOrgName(orgID);

  return {
    props: { orgName },
  };
}

export default function AddVideo(props) {
  const router = useRouter();
  const { orgID } = router.query;
  if (typeof orgID !== "string") return <p>invalid organization</p>;

  const { orgName } = props;

  return (
    <Layout>
      <WindowWidget>
        <VideoCreate
          orgID={parseInt(orgID)}
          orgName={orgName}
          onVideoCreated={(videoID) => {
            router.push("/v/[videoID]", `/v/${videoID}`);
          }}
        />
      </WindowWidget>
    </Layout>
  );
}
