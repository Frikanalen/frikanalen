// vim: set ft=typescript:
// Forgive me. This was my first Node project ever. It's starting to get back into shape.
// Tidying-up PRs _very_ welcome.
import * as dotenv from "dotenv";
dotenv.config();
import express, { RequestHandler } from "express";
import { getLogger } from "./logger.js";
import bodyParser from "body-parser";
import { atemRouter } from "./atem/router.js";
import { posterRouter } from "./poster/router.js";
import atem from "./atem/AtemInterface.js";
import cors from "cors";

const logger = getLogger();
import cookieParser from "cookie-parser";

const handlePing: RequestHandler = (_req, res) => {
  res.send("pong");
};

export const FK_API_URL = process.env["FK_API_URL"];
export const FK_APIV2_URL = process.env["FK_APIV2_URL"];
if (!(FK_API_URL?.length && FK_APIV2_URL?.length)) {
  logger.error("Environments FK_API_URL and FK_APIV2_URL must be set");
  process.exit(1);
}

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

  if (process.env["NODE_ENV"] === "development") {
    logger.info("In development mode, applying CORS headers...");
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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
