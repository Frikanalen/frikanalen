import { RealAtem } from "./RealAtem";
import { MockAtem } from "./MockAtem";

export interface AtemMixEffects {
  readonly input: number;

  setInput: (inputIndex: number) => Promise<void>;
}

export interface AtemConnection {
  ME: AtemMixEffects[];
  connect: (atemHost: string) => Promise<void>;
}

module.exports = {
  RealAtem,
  MockAtem,
};
