import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FIELDSET_HEIGHT } from "../constants";

const SWITCH_KNOB_SIZE = parseInt(FIELDSET_HEIGHT) / 2;
const SWITCH_KNOB_PADDING = 5;

const Container = styled.div<{ active: boolean }>`
  width: ${SWITCH_KNOB_SIZE * 2 + SWITCH_KNOB_PADDING * 2}px;
  height: ${SWITCH_KNOB_SIZE + SWITCH_KNOB_PADDING * 2}px;

  border: solid 2px ${(props) => props.theme.color.divider};
  border-radius: 50px;

  padding: ${SWITCH_KNOB_PADDING - 2}px;

  ::after {
    content: "";
    display: block;

    width: ${SWITCH_KNOB_SIZE}px;
    height: ${SWITCH_KNOB_SIZE}px;

    border-radius: 100px;

    background: ${(props) => props.theme.fontColor.muted};
    transition: 200ms ease all;
  }

  &:hover {
    cursor: pointer;
  }

  ${(props) => {
    if (props.active) {
      return css`
        &::after {
          background: ${props.theme.color.accent};
          transform: translateX(${SWITCH_KNOB_SIZE}px);
        }
      `;
    } else {
      return css`
        &:hover::after {
          background: ${props.theme.fontColor.normal};
        }
      `;
    }
  }}
`;

export type SwitchInputProps = {
  value?: boolean;
  onChange?: (v: boolean) => void;
};

export function SwitchInput(props: SwitchInputProps) {
  const { value, onChange } = props;

  const [active, setActive] = useState(value ?? false);
  useEffect(() => setActive(active), [active]);

  const handleClick = () => {
    if (!onChange) {
      return setActive(!active);
    }

    onChange(active);
  };

  return <Container active={active} onClick={handleClick} />;
}
