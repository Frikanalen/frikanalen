import configs from "../components/configs";
import fetch from "isomorphic-unfetch";
import React, { Component, useContext, useEffect, useState } from "react";
import { MonitoringStream } from "../components/MonitoringStream";
import { Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../components/UserContext";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import TextSlideGenerator from "../components/TextSlideGenerator";

function ATEMPanel() {
  const [currentProgram, setCurrentProgram] = useState(null);

  const getProgramFromATEM = useEffect(() => {
    try {
      fetch(`${configs.api}playout/atem`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => setCurrentProgram(json.inputIndex));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const inputs: { index: number; name: string }[] = [
    { index: 2, name: "tx1" },
    { index: 3, name: "tx2" },
    { index: 1, name: "tx3" },
    { index: 4, name: "rx1" },
    { index: 3010, name: "still 1" },
    { index: 1000, name: "color bars" },
  ];

  const setProgram = async (inputIndex: number) => {
    try {
      var data = await fetch(`${configs.api}playout/atem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputIndex: inputIndex }),
      });
      var json = await data.json();
      setCurrentProgram(json.inputIndex);
    } catch (e) {
      console.log(e);
    }
  };

  const ProgramBus = () => {
    return (
      <div>
        <label>Programutgang:</label>
        <ButtonGroup>
          {inputs.map(({ index, name }) => (
            <Button
              key={index}
              variant={currentProgram == index ? "danger" : "primary"}
              onClick={() => setProgram(index)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    );
  };

  return <ProgramBus />;
}

export default function PlayoutControl() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <TextSlideGenerator show={show} onHide={() => handleClose()} />
      <Container fluid>
        <Row>
          <h1>p-styring</h1>
        </Row>
        <Row>
          <Col>
            <MonitoringStream />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={handleShow}>Tekstplakat...</Button>
            <ATEMPanel />
          </Col>
        </Row>
      </Container>
    </>
  );
}
