import React, { Component } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import Button from "react-bootstrap/Button";

export default class MonitoringStream extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  render() {
    return (
      <div>
        <div ref={this.el} style={{ height: "576px", width: "1024px" }}></div>
      </div>
    );
  }

  componentDidMount() {
    new JSMpeg.VideoElement(this.el.current, "wss://monitoring.frikanalen.no/", {
      videoBufferSize: 512 * 1024 * 20,
      audioBufferSize: 128 * 1024 * 20,
    });
  }
}
