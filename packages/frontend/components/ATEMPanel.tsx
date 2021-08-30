import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import configs from "./configs";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import styled from "@emotion/styled";
type MixEffectsBusInput = { index: number; name: string };

const inputs: MixEffectsBusInput[] = [
  { index: 2, name: "tx1" },
  { index: 3, name: "tx2" },
  { index: 1, name: "tx3" },
  { index: 4, name: "rx1" },
  { index: 3010, name: "still 1" },
  { index: 1000, name: "color bars" },
];

const MixEffectInputsDiv = styled.div`
  margin-bottom: 1em;
  & > label {
    display: block;
    margin-bottom: 0.5em;
    text-align: center;
  }
`;

interface MixEffectsBusProps {
  inputs: MixEffectsBusInput[];
  currentProgram: number | undefined;
  setProgram: (inputIndex: number) => void;
}

export const ProgramBus = ({ inputs, currentProgram, setProgram }: MixEffectsBusProps) => {
  return (
    <MixEffectInputsDiv>
      <label>programutgang</label>
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
    </MixEffectInputsDiv>
  );
};

export function ATEMPanel() {
  const [currentProgram, setCurrentProgram] = useState<number | undefined>(undefined);

  useEffect(() => {
    try {
      fetch(`${configs.api}playout/atem/program`, {
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

  const setProgram = async (inputIndex: number) => {
    try {
      const data = await fetch(`${configs.api}playout/atem/program`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputIndex: inputIndex }),
      });
      const json = await data.json();
      setCurrentProgram(json.inputIndex);
    } catch (e) {
      console.log(e);
    }
  };

  return <ProgramBus inputs={inputs} currentProgram={currentProgram} setProgram={setProgram} />;
}
