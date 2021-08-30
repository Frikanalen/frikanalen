import { AtemConnection, AtemMixEffects } from "./AtemInterface";

class MockAtemME implements AtemMixEffects {
  idx: number;
  currentInput: number;

  constructor(idx: number) {
    this.idx = idx;
    this.currentInput = 1;
  }

  public get input() {
    return this.currentInput;
  }

  public setInput = async (inputIndex: number) => {
    this.currentInput = inputIndex;
  };
}

export class MockAtem implements AtemConnection {
  public ME: AtemMixEffects[];

  constructor() {
    this.ME = [new MockAtemME(0)];
  }

  async connect(hostName: string) {
    return;
  }
}
