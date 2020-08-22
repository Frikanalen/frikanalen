// 		var server = "ws://" + window.location.hostname + ":8188";
//
// Of course this assumes that support for WebSockets has been built in
// when compiling the server. WebSockets support has not been tested
// as much as the REST API, so handle with care!
//
//
// If you have multiple options available, and want to let the library
// autodetect the best way to contact your server (or pool of servers),
// you can also pass an array of servers, e.g., to provide alternative
// means of access (e.g., try WebSockets first and, if that fails, fall
// back to plain HTTP) or just have failover servers:
//
//		var server = [
//			"ws://" + window.location.hostname + ":8188",
//			"/janus"
//		];
//
// This will tell the library to try connecting to each of the servers
// in the presented order. The first working server will be used for
// the whole session.
//

var Janus = null;
var React = require("react");

export default class Realtime extends React.Component {
  handle_message = (msg, jsep) => {
    Janus.debug(" ::: Got a message :::");
    Janus.debug(msg);
    var result = msg["result"];
    if (result !== null && result !== undefined) {
      if (result["status"] !== undefined && result["status"] !== null) {
        var status = result["status"];
        if (status === "stopped") stopStream();
      }
    } else if (msg["error"] !== undefined && msg["error"] !== null) {
      stopStream();
      return;
    }
    if (jsep !== undefined && jsep !== null) {
      Janus.debug("Handling SDP as well...");
      Janus.debug(jsep);
      // Offer from the plugin, let's answer
      this.streaming.createAnswer({
        jsep: jsep,
        // We want recvonly audio/video and, if negotiated, datachannels
        media: { audioSend: false, videoSend: false, data: true },
        success: (jsep) => {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          var body = { request: "start" };
          this.streaming.send({ message: body, jsep: jsep });
        },
        error: function (error) {
          Janus.error("WebRTC error:", error);
        },
      });
    }
  };

  startStream(id) {
    this.streaming.send({ message: { request: "watch", id: id } });
  }
  attach_stream_plugin = () => {
    // Attach to Streaming plugin
    this.janus.attach({
      plugin: "janus.plugin.streaming",
      opaqueId: this.opaqueId,
      success: (pluginHandle) => {
        this.streaming = pluginHandle;
        Janus.log(
          "Plugin attached! (" +
            this.streaming.getPlugin() +
            ", id=" +
            this.streaming.getId() +
            ")"
        );
        this.startStream(1);
      },
      error: function (error) {
        Janus.error("  -- Error attaching plugin... ", error);
      },
      onmessage: this.handle_message,
      onremotestream: (stream) => {
        Janus.attachMediaStream(this.videoRef.current, stream);
      },
    });
  };

  start_session = () => {};
  componentDidMount = () => {
    Janus = require("../components/janus.js").default;
    console.log(Janus);
    this.init_janus();
  };
  init_janus = () => {
    var server = null;
    server = "http://simula.frikanalen.no:3005";

    this.opaqueId = "streamingtest-" + Janus.randomString(12);

    var bitrateTimer = null;
    var spinner = null;

    console.log(Janus);
    Janus.init({
      debug: "all",
      callback: () => {
        if (!Janus.isWebrtcSupported()) {
          return;
        }
        this.janus = new Janus({
          server: server,
          success: this.attach_stream_plugin,
          error: function (error) {},
        });
      },
    });
  };

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.janus = null;
    this.streaming = null;
  }
  render = () => {
    return (
      <div>
        <video autoPlay={true} ref={this.videoRef} />
      </div>
    );
  };
}
