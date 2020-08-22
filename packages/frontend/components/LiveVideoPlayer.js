import Link from "next/link";
import React, { Component } from "react";
import fetch from "isomorphic-unfetch";

export class LiveVideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.video = React.createRef();
  }
  render() {
    return (
      <div id="live">
        <video
          ref={this.video}
          controls
          onClick={this.pause_video}
          src="https://frikanalen.no/frikanalen.webm"
        ></video>
        <style jsx>{`
          #live {
            width: 100%;
            padding: 0;
          }

          #live > .header {
            width: 100%;
            text-align: center;
            font-family: "Roboto", sans-serif;
            font-weight: 600;
            font-size: 20px;
            padding: 5px;
          }

          #live > video {
            width: inherit;
          }
          @media screen and (max-width: 1024px) {
            #live {
            }
          }
        `}</style>
      </div>
    );
  }
}

export default LiveVideoPlayer;
