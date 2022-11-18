import type { AtemConnection, AtemMixEffects } from "./AtemInterface.js";

class MockAtemME implements AtemMixEffects {
  idx: number;
  currentProgram: number;
  currentPreview: number;

  constructor(idx: number) {
    this.idx = idx;
    this.currentProgram = 1;
    this.currentPreview = 1;
  }

  public get program() {
    return this.currentProgram;
  }

  public get preview() {
    return this.currentProgram;
  }

  public setProgram = async (inputIndex: number) => {
    this.currentProgram = inputIndex;
  };

  public setPreview = async (inputIndex: number) => {
    this.currentPreview = inputIndex;
  };
}

export class MockAtem implements AtemConnection {
  public ME: AtemMixEffects[];
  atem: undefined;

  constructor() {
    this.ME = [new MockAtemME(0)];
  }

  async connect(_hostName: string) {
    return;
  }
}
