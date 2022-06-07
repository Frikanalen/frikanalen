import { Atem } from "atem-connection";
import { applyInitialConfiguration } from "./utils";
import { getLogger } from "../logger";
import type { AtemConnection, AtemMixEffects } from "./AtemInterface";

const logger = getLogger();

class RealAtemME implements AtemMixEffects {
  idx: number;
  atem: Atem;

  constructor(idx: number, atem: Atem) {
    this.atem = atem;
    this.idx = idx;
  }

  public get input() {
    if (this.atem.state.video.ME[this.idx] === undefined) {
      throw new Error(`M/E #${this.idx} does not exist!`);
    }
    return this.atem.state.video.ME[this.idx]!.programInput;
  }

  public setInput = async (inputIndex: number) => {
    await this.atem.changeProgramInput(inputIndex, this.idx);
  };
}

export class RealAtem implements AtemConnection {
  public ME: RealAtemME[];
  public atem: Atem;

  constructor() {
    this.atem = new Atem();
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
