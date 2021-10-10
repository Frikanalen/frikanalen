import { MixEffectsBusInput } from "./types";

export const STILLS_GENERATOR_URL = "https://stills-generator.frikanalen.no";

export const ATEM_INPUTS: MixEffectsBusInput[] = [
  { index: 2, name: "TX1" },
  { index: 3, name: "TX2" },
  { index: 1, name: "TX3" },
  { index: 4, name: "RX1" },
  { index: 3010, name: "Still 1" },
  { index: 1000, name: "Color bars" },
];
