import { RealAtem } from "./RealAtem";
import { MockAtem } from "./MockAtem";
import type { Atem } from "atem-connection";
import { getLogger } from "../logger";

const logger = getLogger();

export interface AtemMixEffects {
  readonly input: number;

  setInput: (inputIndex: number) => Promise<void>;
}

export interface AtemConnection {
  ME: AtemMixEffects[];
  connect: (atemHost: string) => Promise<void>;
  atem: Atem | undefined;
}

const getAtem = (): AtemConnection => {
  if (atem) return atem;

  if (process.env["ATEM_HOST"]) {
    return new RealAtem();
  } else {
    logger.warn("ATEM_HOST environment not set; operating in dummy mode!");
    return new MockAtem();
  }
};

export const atem = getAtem();
export default atem;
