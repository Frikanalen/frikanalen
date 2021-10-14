import styled from "@emotion/styled";
import { useRef } from "react";
import { useInterpolatedValue } from "../hooks/useInterpolatedValue";

const PROGRESS_BAR_HEIGHT = "4px";

const Container = styled.div`
  position: relative;

  background: ${(props) => props.theme.color.divider};
  height: ${PROGRESS_BAR_HEIGHT};

  border-radius: 4px;
`;

const Fill = styled.div<{ state: ProgressBarState }>`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;

  border-radius: 4px;

  transform-origin: 0 0;
  background: ${(props) => {
    const { state, theme } = props;
    const { color, stateColor } = theme;

    const map = {
      normal: color.accent,
      warning: stateColor.warning,
      danger: stateColor.danger,
    };

    return map[state];
  }};
`;

export type ProgressBarState = "normal" | "warning" | "danger";

export type ProgressBarProps = {
  state?: ProgressBarState;
  className?: string;
  value: number;
};

export function ProgressBar(props: ProgressBarProps) {
  const { value, className, state = "normal" } = props;
  const fillRef = useRef<HTMLDivElement>(null);

  useInterpolatedValue(value, (interpolatedValue) => {
    const fill = fillRef.current;
    if (!fill) return;

    fill.style.transform = `scaleX(${interpolatedValue})`;
  });

  return (
    <Container className={className}>
      <Fill state={state} ref={fillRef} />
    </Container>
  );
}
