import React, { useContext, useState } from "react";
import fetch from "isomorphic-unfetch";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import {UserContext, UserContextLoggedInState} from "./UserContext";

interface Props {
  show: boolean;
  onHide: () => void;
}
export default function TextSlideGenerator(props: Props): JSX.Element {
  const context = useContext(UserContext);

  // FIXME: Hardcoded URLs
  const { show, onHide } = props;
  const [posterText, setPosterText] = useState<string>("");
  const [posterHeading, setPosterHeading] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const imageURL = 'https://stills-generator.frikanalen.no/poster/preview?text=&heading=",';

  const { token } = context as UserContextLoggedInState;

  const uploadPoster = async (heading: string, text: string): Promise<void> => {
    setStatusMessage("Laster opp...");
    await fetch("https://stills-generator.frikanalen.no/poster/upload", {
      method: "post",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        heading,
      }),
    });
    setStatusMessage(null);
  };
  if (!context.isLoggedIn) {
    return <></>;
  }

  return (
    <Modal className="text-dark" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Sendingsplakat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Overskrift</Form.Label>
            <Form.Control onChange={(event): void => setPosterHeading(event.target.value)} placeholder="overskrift" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tekst</Form.Label>
            <Form.Control
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => setPosterText(event.currentTarget.value)}
              as="textarea"
              placeholder="tekst"
            />
          </Form.Group>
        </Form>
        <Image fluid id="poster" alt="Forhåndsvisning plakat" src={imageURL} />
      </Modal.Body>
      <Modal.Footer>
        {statusMessage}
        <Button variant="secondary" onClick={onHide}>
          Lukk
        </Button>
        <Button variant="primary" onClick={(): Promise<void> => uploadPoster(posterHeading, posterText)}>
          Last opp
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
