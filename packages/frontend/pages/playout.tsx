import React, { useState } from "react";
import dynamic from "next/dynamic";

import Button from "react-bootstrap/Button";
import TextSlideGenerator from "../components/TextSlideGenerator";
import styled from "@emotion/styled";
import { ATEMPanel } from "../components/ATEMPanel";
const MonitoringStream = dynamic(() => import("../components/MonitoringStream"), { ssr: false });
const TextSlideGeneratorButton = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <TextSlideGenerator show={visible} onHide={() => setVisible(false)} />
      <Button onClick={() => setVisible(!visible)}>Tekstplakat...</Button>
    </>
  );
};

const PlayoutControlPanel = styled.div`
  color: white;
  background-color: black;
  max-width: 100%;
`;

const SplitPanel = styled.div`
  display: flex;
  max-width: 100%;
`;

const LeftSide = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow: no-scroll;
`;

const RightSide = styled.div`
  flex-base: 700px;
`;

export default function PlayoutControl() {
  return (
    <PlayoutControlPanel>
      <h1>Playout-styring</h1>
      <SplitPanel>
        <LeftSide>
          <MonitoringStream />
        </LeftSide>
        <RightSide>
          <ATEMPanel />

          <TextSlideGeneratorButton />
        </RightSide>
      </SplitPanel>
    </PlayoutControlPanel>
  );
}
