// vim: set ft=typescript:
// Forgive me. This was my first Node project ever. It's starting to get back into shape.
// Tidying-up PRs _very_ welcome.

import { RealAtem } from "./atem/RealAtem";

import express from "express";
import { getLogger } from "./logger";
import { checkIfStaff } from "./auth";
import { AtemConnection } from "./atem/AtemInterface";
import { MockAtem } from "./atem/MockAtem";

const logger = getLogger();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ATEM_HOST = process.env.ATEM_HOST || undefined;
export const FK_API_URL = process.env.FK_API_URL || "https://frikanalen.no/api";

// The ATEM video mixer's multiviewer output is looped back in on input 10.
export const MULTI_VIEWER_INPUT = 10;
export interface AtemControlOptions {
  listenPort: number;
  atemHost?: string;
}
class AtemControl {
  private listenPort: number;
  atem: AtemConnection;
  app = express.application;
  atemHost: string | undefined;

  constructor({ listenPort, atemHost }: AtemControlOptions) {
    this.listenPort = listenPort;
    this.app = express();
    this.atemHost = atemHost;

    if (atemHost) {
      this.atem = new RealAtem();
    } else {
      this.atem = new MockAtem();
    }
  }

  async run() {
    if (this.atemHost) {
      logger.info(`Connecting to ATEM at ${this.atemHost}`);
      await this.atem.connect(this.atemHost);
        console.log('asdf')
    }

    this.app.use(cookieParser());
    this.app.use(bodyParser.json());

    this.app.get("/program", (req, res) => {
      res.send({ inputIndex: this.atem.ME[0].input });
    });

    this.app.get("/ping", (req, res) => {
      res.send("pong");
    });

    this.app.post("/program", async (req, res) => {
      const inputIndex = parseInt(req.body.inputIndex);
      const isStaff = await checkIfStaff(req.cookies);

      if (isNaN(inputIndex)) {
        res
          .status(400)
          .send("Malformed request, expected {inputIndex: integer}")
          .end();
        return;
      }

      if (!isStaff) {
        res.status(403).send("User must be staff").end();
        return;
      }

      await this.atem.ME[0].setInput(inputIndex);
      res.send({ inputIndex: this.atem.ME[0].input });
    });

    this.app.listen(this.listenPort, () => {
      logger.info(`Server listening on port ${this.listenPort}...`);
    });
  }
}

const getListenPort = () => {
  const portEnv = parseInt(process.env?.LISTEN_PORT || "");
  const defaultPort = 8089;

  if (isNaN(portEnv)) {
    logger.warn(
      `LISTEN_PORT environment not set or NaN; defaulting to port ${defaultPort}.`
    );
    return defaultPort;
  }
  return portEnv;
};

const main = async () => {
  const atem = new AtemControl({
    listenPort: getListenPort(),
    atemHost: ATEM_HOST,
  });
  logger.info(`atem control service starting...`);
  try {
    if (ATEM_HOST === undefined) {
      logger.warn("ATEM_HOST environment not set; operating in dummy mode!");
    }

    await atem.run();
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

main().then(() => null);
