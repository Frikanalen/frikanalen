import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    color: {
      card: string;
      accent: string;
      secondAccent: string;
      thirdAccent: string;
    };
    fontColor: {
      normal: string;
      muted: string;
    };
  }
}
