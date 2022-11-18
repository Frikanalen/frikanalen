import { RealAtem } from "./RealAtem.js";
import { MockAtem } from "./MockAtem.js";
import type { Atem } from "atem-connection";
import { getLogger } from "../logger.js";

const logger = getLogger();

export interface AtemMixEffects {
  readonly program: number;
  readonly preview: number;

  setProgram: (inputIndex: number) => Promise<void>;
  setPreview: (inputIndex: number) => Promise<void>;
}

export interface AtemConnection {
  ME: AtemMixEffects[];
  connect: (atemHost: string) => Promise<void>;
  atem: Atem | undefined;
}

const getAtem = (): AtemConnection => {
  if (process.env["ATEM_HOST"]) {
    return new RealAtem();
  } else {
    logger.warn("ATEM_HOST environment not set; operating in dummy mode!");
    return new MockAtem();
  }
};

const atem = getAtem();
export default atem;
