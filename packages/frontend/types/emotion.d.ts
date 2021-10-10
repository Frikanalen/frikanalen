import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    color: {
      card: string;
      accent: string;
      secondAccent: string;
      thirdAccent: string;
      divider: string;
      overlay: string;
    };
    stateColor: {
      success: string;
      warning: string;
      danger: string;
      tip: string;
    };
    fontColor: {
      overlay: string;
      normal: string;
      muted: string;
      subdued: string;
    };
  }
}
