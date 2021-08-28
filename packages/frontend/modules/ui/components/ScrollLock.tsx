import React, { useEffect } from "react";
import { useRef } from "react";
import { CSSProperties } from "react";
import { useWindowEvent } from "../hooks/useWindowEvent";

export type ScrollLockProps = {
  locked: boolean;
  children: (style?: CSSProperties) => React.ReactNode;
};

export const ScrollLockContext = React.createContext<[boolean, number]>([false, 0]);

const { Provider, Consumer } = ScrollLockContext;

export function ScrollLock(props: ScrollLockProps) {
  const { locked, children } = props;
  const scrollYRef = useRef(0);

  useWindowEvent("scroll", () => {
    if (!locked) {
      scrollYRef.current = window.scrollY;
    }
  });

  useEffect(() => {
    if (!locked) {
      window.scrollTo(0, scrollYRef.current);
    }
  }, [locked]);

  const style: CSSProperties = locked
    ? {
        position: "fixed",
        left: "0px",
        right: "0px",
        top: `-${scrollYRef.current}px`,
      }
    : {};

  return <Provider value={[locked, scrollYRef.current]}>{children(style)}</Provider>;
}

ScrollLock.Consumer = Consumer;
