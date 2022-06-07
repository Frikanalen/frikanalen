// Use the websocket-relay to serve a raw MPEG-TS over WebSockets. You can use
// ffmpeg to feed the relay. ffmpeg -> websocket-relay -> browser
// Example:
// node websocket-relay yoursecret 8081 8082
// ffmpeg -i <some input> -f mpegts http://localhost:8081/yoursecret

import type { RequestListener } from "http";

const http = require("http");

import * as WebSocket from "ws";
import { Logger } from "tslog";

export const log: Logger = new Logger();

if (process.argv.length < 3) {
  log.error(`Usage: <secret> [<stream-port> <websocket-port>]`);
  process.exit();
}

const numberFromEnvOrDefault = (env?: string, fallback?: number) => {
  const parsedInt = parseInt(env ?? "");

  if (isNaN(parsedInt)) {
    if (!fallback) {
      throw new Error(
        `Could not get configuration from command line and no default specified!`
      );
    } else {
      return fallback;
    }
  }
  return parsedInt;
};

const WEBSOCKET_PORT = numberFromEnvOrDefault(process.argv[4], 8082);
const STREAM_PORT = numberFromEnvOrDefault(process.argv[3], 8081);
const STREAM_SECRET = process.argv[2];

// Websocket Server
const socketServer = new WebSocket.Server({
  port: WEBSOCKET_PORT,
  perMessageDeflate: false,
});
let connectionCount = 0;
socketServer.on("connection", function (socket, upgradeReq) {
  log.info(
    `New listener; ${upgradeReq.socket.remoteAddress} ${
      upgradeReq.headers["user-agent"]
    } (total ${++connectionCount})`
  );

  socket.on("close", (_code, _message) => {
    log.info(`Listener disconnected; now ${--connectionCount} total`);
  });
});

const broadcast = (chunk: any) =>
  socketServer.clients.forEach((client) => {
    client.readyState === WebSocket.OPEN && client.send(chunk);
  });

const requestListener: RequestListener = (req, res) => {
  if (!req.url) {
    log.error("Could not create listener; URL is falsy");
    log.error(req);
    return;
  }

  const { remoteAddress: addr, remotePort: port } = req.socket;

  let params = req.url.substring(1).split("/");
  log.info({ params });

  if (params[0] !== STREAM_SECRET) {
    log.error(
      `Rejected ${addr}:${port}; secret "${params[0]}"!="${STREAM_SECRET}".`
    );
    res.end();
    return;
  }

  log.info(`Stream opened from ${addr}:${port}`);

  req.on("data", (chunk: any) => broadcast(chunk));

  req.on("end", () => log.info("Socked closed"));
};

// HTTP Server to accept incomming MPEG-TS Stream from ffmpeg
http.createServer(requestListener).listen(STREAM_PORT);

log.info(`Awaiting TS on http://127.0.0.1:${STREAM_PORT}/${STREAM_SECRET}`);
log.info(`Awaiting WebSocket connections on ws://127.0.0.1:${WEBSOCKET_PORT}/`);
