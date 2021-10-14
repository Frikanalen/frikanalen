import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Option } from "modules/form/fields/select";
import { toggleArrayItem } from "modules/lang/array";
import { PrimaryPopover } from "modules/popover/components/PrimaryPopover";
import { usePopover } from "modules/popover/hooks/usePopover";
import { usePopoverContext } from "modules/popover/hooks/usePopoverContext";
import { Button, ButtonWithProps } from "modules/ui/components/Button";
import { SVGIcon, SVGIconWithProps } from "modules/ui/components/SVGIcon";
import { useWindowEvent } from "modules/ui/hooks/useWindowEvent";
import { useEffect, useRef, useState } from "react";
import { FIELDSET_HEIGHT } from "../constants";

const PopoverContainer = styled(PrimaryPopover)`
  margin: 16px 0px;
  padding: 8px 0px;

  display: flex;
  flex-direction: column;

  max-height: ${38 * 6}px;
  overflow-y: auto;
`;

const OptionContainer = styled(Button as ButtonWithProps<{ active: boolean }>)`
  padding: 12px 16px;
  font-size: 0.9em;

  transition: 200ms ease color;

  ${(props) => {
    if (!props.active)
      return css`
        color: ${props.theme.fontColor.muted};

        &:hover {
          color: ${props.theme.fontColor.normal};
        }
      `;

    return css`
      color: ${props.theme.color.accent};
      pointer-events: none;
    `;
  }}
`;

type PopoverProps = {
  selected: any[];
  options: Option[];
  onSelect: (value: any) => void;
};

function Popover(props: PopoverProps) {
  const { selected, options, onSelect } = props;

  const { popover } = usePopoverContext();
  const { anchor } = popover;
  const [width, setWidth] = useState(anchor.getBoundingClientRect().width);

  useWindowEvent("resize", () => {
    setWidth(anchor.getBoundingClientRect().width);
  });

  return (
    <PopoverContainer style={{ width }}>
      {options.map((o) => (
        <OptionContainer active={selected.includes(o.value)} key={o.value} onClick={() => onSelect(o.value)}>
          {o.label}
        </OptionContainer>
      ))}
    </PopoverContainer>
  );
}

const Container = styled(Button as ButtonWithProps<{ active: boolean }>)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  position: relative;
  height: ${FIELDSET_HEIGHT};

  font-size: 0.9em;
  padding: 0px 12px;

  border-radius: 4px;

  border: solid 1px ${(props) => (props.active ? props.theme.color.accent : props.theme.color.divider)};
  transition: 200ms ease border-color;
`;

const Chevron = styled(SVGIcon as SVGIconWithProps<{ flipped: boolean }>)`
  margin-left: 16px;

  width: 16px;
  height: 16px;

  transition: 200ms ease transform;

  ${(props) =>
    props.flipped
      ? css`
          transform: rotate(180deg);
        `
      : null}
`;

const LongestLabel = styled.span`
  opacity: 0;
  user-select: none;
`;

const Label = styled.span`
  position: absolute;
  left: 12px;
`;

const DEFAULT_LABEL = "Klikk for å velge";

export type DropdownInputProps = {
  className?: string;
  multiple?: boolean;
  options: Option[];
  value?: any[];
  onChange?: (value: any[]) => void;
};

export function DropdownInput(props: DropdownInputProps) {
  const { className, multiple, options, value, onChange } = props;
  const ref = useRef<HTMLButtonElement>(null);

  const [selected, setSelected] = useState<any[]>([]);
  const longestLabel = [...options.map((o) => o.label), DEFAULT_LABEL].reduce((a, b) => (a.length > b.length ? a : b));

  useEffect(() => {
    setSelected(value || []);
  }, [value]);

  const select = (value: any) => {
    if (!multiple) {
      const newValue = [value];

      setSelected(newValue);
      onChange?.(newValue);
      dismiss();

      return;
    }

    const newSelected = toggleArrayItem(selected, value);

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const { active, toggle, dismiss } = usePopover({
    ref,
    render: () => <Popover selected={selected} options={options} onSelect={select} />,
    placement: "bottom-start",
  });

  const renderSelected = () => {
    if (selected.length === 0) return DEFAULT_LABEL;

    return options
      .filter((o) => selected.includes(o.value))
      .map((o) => o.label)
      .join(", ");
  };

  return (
    <Container className={className} onClick={toggle} ref={ref} active={active}>
      <LongestLabel>{longestLabel}</LongestLabel>
      <Label>{renderSelected()}</Label>
      <Chevron flipped={active} name="chevronDown" />
    </Container>
  );
}
