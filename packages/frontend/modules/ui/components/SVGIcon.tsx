import * as icons from "../icons";
import { IconType } from "../types";
import React from "react";

export type SVGIconProps = {
  className?: string;
  name: IconType;
};

export function SVGIcon(props: SVGIconProps) {
  const { name, className } = props;

  if (!icons[name]) return null;

  return React.cloneElement(icons[name], {
    className,
    width: "100%",
    height: "100%",
  });
}

export type SVGIconWithProps<T extends object> = (props: SVGIconProps & T) => JSX.Element;
