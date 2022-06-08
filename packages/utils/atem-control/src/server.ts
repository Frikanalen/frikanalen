// vim: set ft=typescript:
// Forgive me. This was my first Node project ever. It's starting to get back into shape.
// Tidying-up PRs _very_ welcome.

import express, { RequestHandler } from "express";
import { getLogger } from "./logger";
const logger = getLogger();
const cookieParser = require("cookie-parser");
import bodyParser from "body-parser";
import { atemRouter } from "./atem/router";
import { posterRouter } from "./poster/router";
import atem from "./atem/AtemInterface";
const handlePing: RequestHandler = (_req, res) => {
  res.send("pong");
};
export const FK_API_URL =
  process.env["FK_API_URL"] || "https://frikanalen.no/api";

// The ATEM video mixer's multiviewer output is looped back in on input 10.
export const MULTI_VIEWER_INPUT = 10;

const getListenPort = () => {
  const portEnv = parseInt(process.env["LISTEN_PORT"] || "");
  const defaultPort = 8089;

  if (isNaN(portEnv)) {
    logger.warn(`PORT environment not set; defaulting to ${defaultPort}.`);
    return defaultPort;
  }
  return portEnv;
};

const main = async () => {
  const app = express();

  if (process.env["ATEM_HOST"]) {
    logger.info(`Connecting to ATEM at ${process.env["ATEM_HOST"]}`);
    await atem.connect(process.env["ATEM_HOST"]);
    logger.info("Connected.");
  }

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.get("/ping", handlePing);
  app.use("/poster", posterRouter);
  app.use(atemRouter);

  const listenPort = getListenPort();
  app.listen(listenPort, () => {
    logger.info(`Server listening on port ${listenPort}...`);
  });
};

main().then(() => null);
