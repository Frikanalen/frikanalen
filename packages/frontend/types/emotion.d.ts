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
    fontColor: {
      normal: string;
      muted: string;
      subdued: string;
    };
  }
}
