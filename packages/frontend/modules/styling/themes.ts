import { Theme } from "@emotion/react";

export const lightTheme: Theme = {
  color: {
    background: "#fff",
    card: "rgba(255, 255, 255, 1)",
    accent: "#E88840",
    secondAccent: "#F15645",
    thirdAccent: "#64BC50",
    divider: "rgba(0, 0, 0, 0.2)",
    overlay: "rgba(0, 0, 0, 0.2)",
  },
  stateColor: {
    success: "#46C400",
    warning: "#FFB657",
    danger: "#FF5A49",
    tip: "#FFE766",
  },
  fontColor: {
    overlay: "rgba(255, 255, 255, 1)",
    normal: "rgba(0, 0, 0, 0.85)",
    muted: "rgba(0, 0, 0, 0.7)",
    subdued: "rgba(0, 0, 0, 0.5)",
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  color: {
    ...lightTheme.color,
    card: "#1c1c1c",
    background: "#131313",
    divider: "rgba(255, 255, 255, 0.2)",
  },
  fontColor: {
    overlay: "rgba(255, 255, 255, 1)",
    normal: "rgba(255, 255, 255, 0.85)",
    muted: "rgba(255, 255, 255, 0.7)",
    subdued: "rgba(255, 255, 255, 0.5)",
  },
};
