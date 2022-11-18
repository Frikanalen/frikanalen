import Atem from "atem-connection";
import { applyInitialConfiguration } from "./utils.js";
import { getLogger } from "../logger.js";
import type { AtemConnection, AtemMixEffects } from "./AtemInterface.js";
import type { MixEffect } from "atem-connection/dist/state/video";

const logger = getLogger();

class RealAtemME implements AtemMixEffects {
  idx: number;
  atem: Atem.Atem;
  me: MixEffect;

  constructor(idx: number, atem: Atem.Atem) {
    this.atem = atem;

    if (!atem.state)
      throw new Error("Cannot construct ME with empty Atem state");

    const me = atem.state.video.mixEffects[idx];
    if (!me) throw new Error("Cannot construct ME which does not exist");
    this.me = me;

    this.idx = idx;
  }

  private getME() {
    const me = this.atem.state?.video.mixEffects[this.idx];

    if (me === undefined) {
      throw new Error(`M/E #${this.idx} does not exist!`);
    }

    return me;
  }

  public get program() {
    const { programInput } = this.getME();

    if (programInput === undefined) {
      throw new Error(`M/E #${this.idx} is not online!`);
    }

    return programInput;
  }

  public get preview() {
    const { previewInput } = this.getME();

    if (previewInput === undefined) {
      throw new Error(`M/E #${this.idx} is not online!`);
    }

    return previewInput;
  }

  public setProgram = async (inputIndex: number) => {
    await this.atem.changeProgramInput(inputIndex, this.idx);
  };

  public setPreview = async (inputIndex: number) => {
    await this.atem.changePreviewInput(inputIndex, this.idx);
  };
}

export class RealAtem implements AtemConnection {
  public ME: RealAtemME[];
  public atem: Atem.Atem;

  constructor() {
    this.atem = new Atem.Atem();
    this.ME = [new RealAtemME(0, this.atem)];
  }

  async connect(hostName: string) {
    return new Promise<void>(async (resolve) => {
      logger.info(`Connecting to ATEM mixer at ${hostName}.`);

      await this.atem.connect(hostName);

      this.atem.on("error", logger.error);

      this.atem.on("stateChanged", (state, _pathToChange) => {
        logger.info(state); // catch the ATEM state.
      });

      this.atem.on("connected", async () => {
        logger.info("Connected to ATEM");
        await applyInitialConfiguration(this.atem);
        resolve();
      });
    });
  }
}
