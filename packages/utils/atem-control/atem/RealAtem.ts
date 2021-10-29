import { Atem } from "atem-connection";
import { applyInitialConfiguration } from "./utils";
import { getLogger } from "../logger";
import { AtemConnection, AtemMixEffects } from "./AtemInterface";

const logger = getLogger();

class RealAtemME implements AtemMixEffects {
  idx: number;
  atem: Atem;

  constructor(idx: number, atem: Atem) {
    this.atem = atem;
    this.idx = idx;
  }

  public get input() {
    const programInput = this.atem.state.video.ME[this.idx].programInput;
    return programInput;
  }

  public setInput = async (inputIndex: number) => {
    await this.atem.changeProgramInput(inputIndex, this.idx);
  };
}

export class RealAtem implements AtemConnection {
  public ME: RealAtemME[];
  private atem: Atem;

  constructor() {
    this.atem = new Atem();
    this.ME = [new RealAtemME(0, this.atem)];
  }

  async connect(hostName: string) {
    this.atem.on("error", logger.error);

    await this.atem.connect(hostName);
    logger.info(`Connected to ATEM mixer at ${hostName}.`);
    this.atem.on("stateChanged", (state, pathToChange) => {
      logger.debug(state); // catch the ATEM state.
    });
    this.atem.on("connected", () => applyInitialConfiguration(this.atem));
  }
}
