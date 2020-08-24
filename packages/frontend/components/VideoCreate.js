import { Component } from "react";

import Layout from "./Layout";
import WindowWidget from "./WindowWidget";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import Video, { get_categories } from "./API/Video";
import ProfileFetcher from "./API/User";

export default class VideoCreate extends Component {
  constructor(props) {
    super(props);

    this.onVideoCreated = props.onVideoCreated;
    this.state = {
      errors: null,
      video: new Video(),
      possibleCategories: [],
      editorOrgs: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    get_categories().then((categories) => {
      this.setState({ possibleCategories: categories });
    });
    ProfileFetcher().then((userProfile) => {
      const editorOrgs = userProfile.organization_roles.filter(
        (r) => r.role == "editor"
      );
      this.setState({ editorOrgs: editorOrgs });
      this.state.video.setOrganization(editorOrgs[0].organization_id);
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
    return (
      <div>
        <Form>
          {this.state.errors}
          <Form.Group>
            <Form.Label>På vegne av:</Form.Label>
            <Form.Control onChange={(e) => console.log(e)} as="select">
              {this.state.editorOrgs.map((r) => (
                <option key={r.organization_id} value={r.organization_id}>
                  {r.organization_name}
                </option>
              ))}
            </Form.Control>
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
