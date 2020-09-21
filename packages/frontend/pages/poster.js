import React, { Component } from "react";
import WindowWidget from "../components/WindowWidget";
import fetch from "isomorphic-unfetch";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Layout from "../components/Layout";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

export default class PosterManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      heading: "",
      imageUrl: "https://stills-generator.frikanalen.no/preview?text=&heading=",
    };
  }

  resetImageTimeout() {
    const stillsGeneratorBase = "https://stills-generator.frikanalen.no/";
    const queryString =
      "preview/?text=" + this.state.text + "&heading=" + this.state.heading;
    this.setState({ imageUrl: stillsGeneratorBase + queryString });
  }

  async uploadPoster() {
    fetch("https://stills-generator.frikanalen.no/upload", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: this.state.text,
        heading: this.state.heading,
      }),
      credentials: "include",
    });
  }

  setText(text) {
    this.setState({ text: text }, this.resetImageTimeout);
  }

  setHeading(heading) {
    this.setState({ heading: heading }, this.resetImageTimeout);
  }

  render() {
    return (
      <Layout>
        <WindowWidget>
          <Modal.Dialog className="text-dark">
            <Modal.Header closeButton>
              <Modal.Title>Sendingsplakat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Overskrift</Form.Label>
                  <Form.Control
                    onChange={(event) => this.setHeading(event.target.value)}
                    placeholder="overskrift"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Tekst</Form.Label>
                  <Form.Control
                    onChange={(event) => this.setText(event.target.value)}
                    as="textarea"
                    placeholder="tekst"
                  />
                </Form.Group>
              </Form>
              <Image fluid id="poster" src={this.state.imageUrl} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary">Avbryt</Button>
              <Button variant="primary" onClick={() => this.uploadPoster()}>
                Last opp
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </WindowWidget>
      </Layout>
    );
  }
}
