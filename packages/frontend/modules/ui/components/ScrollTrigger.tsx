import { useCallback, useEffect, useRef } from "react";
import { useWindowEvent } from "../hooks/useWindowEvent";

export type ScrollTriggerProps = {
  direction?: "up" | "down";
  onTrigger: (recheck: () => void) => void;
};

const SCROLL_THRESHOLD = 150;

export function ScrollTrigger(props: ScrollTriggerProps) {
  const { direction = "down", onTrigger } = props;
  const rootRef = useRef<HTMLDivElement>(null);

  const check = useCallback(() => {
    const { current: root } = rootRef;
    if (!root) return;

    const { top, bottom } = root.getBoundingClientRect();
    const padding = SCROLL_THRESHOLD;

    if (direction === "up" && bottom < padding) {
      onTrigger(check);
    }

    if (direction === "down" && top - window.innerHeight < padding) {
      onTrigger(check);
    }
  }, [direction, onTrigger]);

  useWindowEvent("scroll", () => {
    check();
  });

  useEffect(() => {
    check();
  }, [check]);

  return <div ref={rootRef}></div>;
}
