import { RealAtem } from "./RealAtem";
import { MockAtem } from "./MockAtem";
import type { Atem } from "atem-connection";

export interface AtemMixEffects {
  readonly input: number;

  setInput: (inputIndex: number) => Promise<void>;
}

export interface AtemConnection {
  ME: AtemMixEffects[];
  connect: (atemHost: string) => Promise<void>;
  atem: Atem | undefined;
}

module.exports = {
  RealAtem,
  MockAtem,
};
