export as namespace JSMpeg;

declare module "@cycjimmy/jsmpeg-player" {
  export type JSMpegOptions = { audioBufferSize: number; videoBufferSize: number };
  export class Player {
    setVolume(volume: number);
    getVolume(): number;
  }
  export class VideoElement {
    constructor(element: HTMLElement, uri: string, options: JSMpegOptions);
    player: Player;
  }
}
