import React, { useEffect, useLayoutEffect } from "react";
import { useRef } from "react";
import { CSSProperties } from "react";
import { useWindowEvent } from "../hooks/useWindowEvent";

export type ScrollLockProps = {
  locked: boolean;
  children: (style?: CSSProperties) => React.ReactNode;
};

export const ScrollLockContext = React.createContext<[boolean, number]>([false, 0]);

const { Provider, Consumer } = ScrollLockContext;

// This needs to be a class component, as it relies on some hacky ways of getting the scroll position before re-render
// If you can figure out how to convert it to a function component, that'd be great
export class ScrollLock extends React.Component<ScrollLockProps> {
  public static Consumer = Consumer;
  private scrollY = 0;

  public shouldComponentUpdate() {
    if (!this.props.locked) {
      this.scrollY = window.scrollY;
    }

    return true;
  }

  public componentDidUpdate() {
    if (!this.props.locked) {
      window.scrollTo({
        top: this.scrollY,
        behavior: "auto",
      });
    }
  }

  public render() {
    const { locked, children } = this.props;

    const style: CSSProperties | undefined = locked
      ? {
          position: "fixed",
          left: "0px",
          right: "0px",
          top: `-${this.scrollY}px`,
        }
      : undefined;

    return <Provider value={[locked, this.scrollY]}>{children(style)}</Provider>;
  }
}
