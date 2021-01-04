import React, { Component } from "react";
import { useRouter } from "next/router";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Layout from "components/Layout";
import WindowWidget from "components/WindowWidget";

import config from "components/configs";
import Video, { getCategories } from "components/API/Video";
import { UserContext } from "../../../components/UserContext";
import { fkCategory, fkOrg, getOrg } from "../../../components/TS-API/API";
import { GetServerSideProps } from "next";

interface fkOrganizationJSON {
  id: number;
  name: string;
}
interface VideoCreateProps {
  orgID: number;
  orgName: string;
  onVideoCreated: any;
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

  constructor(props: VideoCreateProps) {
    super(props);
    const { orgID, orgName, onVideoCreated } = props;

    this.onVideoCreated = onVideoCreated;
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

  handleSubmit(event: React.MouseEvent<HTMLElement>) {
    const { token } = this.context;
    event.preventDefault();
    this.state.video
      .save(token)
      .then((r) => {
        console.log("redirecting to ", this.state.video.ID);
        this.onVideoCreated(this.state.video.ID);
      })
      .catch((e) => {
        console.log(e);

        if ("response" in e) {
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
            console.log(e);
          }
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
              {this.state.possibleCategories.map((cat: fkCategory) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            onClick={(e) => {
              this.handleSubmit(e);
            }}
            variant="primary"
            type="submit"
          >
            Start
          </Button>
        </Form>
      </div>
    );
  }
}

VideoCreate.contextType = UserContext;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (typeof context.query.orgID != "string" || isNaN(parseInt(context.query.orgID))) {
    throw new Error(`Invalid organization ID "${context.query.orgID}"`);
  }

  const org = await getOrg(parseInt(context.query.orgID));

  return {
    props: {
      org,
    },
  };
};

interface AddVideoProps {
  org: fkOrg;
}

export default function AddVideo({ org }: AddVideoProps) {
  const router = useRouter();

  return (
    <Layout>
      <WindowWidget>
        <VideoCreate
          orgID={org.id}
          orgName={org.name}
          onVideoCreated={(videoID: number) => {
            router.push("/video/[videoID]", `/video/${videoID}`);
          }}
        />
      </WindowWidget>
    </Layout>
  );
}
