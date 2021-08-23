import configs from "../components/configs";
import fetch from "isomorphic-unfetch";
import React, { Component, useContext, useEffect, useState } from "react";
import MonitoringStream from "../components/MonitoringStream";
import { Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../components/UserContext";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import TextSlideGenerator from "../components/TextSlideGenerator";

function ATEMPanel() {
  const { token } = useContext(UserContext);
  const [currentProgram, setCurrentProgram] = useState(null);

  const getProgramFromATEM = useEffect(() => {
    try {
      fetch(configs.atem, {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => setCurrentProgram(json.inputIndex));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const inputs = [
    { index: 2, name: "tx1" },
    { index: 3, name: "tx2" },
    { index: 1, name: "tx3" },
    { index: 4, name: "rx1" },
    { index: 3010, name: "still 1" },
    { index: 1000, name: "color bars" },
  ];

  const setProgram = async (inputIndex) => {
    try {
      var data = await fetch(configs.atem, {
        method: "POST",
        headers: {
          Authorization: "Token " + token,
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

  const inputButton = (props) => {
    const { index, name } = props;
    let buttonVariant = "primary";
    if (currentProgram == index) buttonVariant = "danger";
    return (
      <Button key={index} variant={buttonVariant} onClick={() => setProgram(index)}>
        {name}
      </Button>
    );
  };

  const ProgramBus = (props) => {
    return (
      <div>
        <label>Programutgang:</label>
        <ButtonGroup>{inputs.map((index, name) => inputButton(index, name))}</ButtonGroup>
        <style jsx>{`
          label {
            padding-right: 15px;
          }
          div {
            background: black;
            color: white;
            padding: 10px;
          }
        `}</style>
      </div>
    );
  };

  return <ProgramBus />;
}

export default function P() {
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
            <Button onClick={handleShow}>Test</Button>
            <ATEMPanel />
          </Col>
        </Row>
      </Container>
    </>
  );
}
