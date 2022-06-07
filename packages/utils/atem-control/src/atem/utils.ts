import type { Atem } from "atem-connection";
import { AudioMixOption } from "atem-connection/dist/enums";
import { MULTI_VIEWER_INPUT } from "../server";

/**
 * Apply initial state to the ATEM mixer.
 *
 * @param atem - ATEM mixer instance.
 */
export const applyInitialConfiguration = async (atem: Atem) => {
  const afv = AudioMixOption.AudioFollowVideo;

  try {
    await atem.setAudioMixerInputProps(1, { mixOption: afv });
    await atem.setAudioMixerInputProps(2, { mixOption: afv });
    await atem.setAudioMixerInputProps(3, { mixOption: afv });
    await atem.setAudioMixerInputProps(4, { mixOption: afv });
  } catch (e) {
    console.log("got exception while setting audio mixer input props");
    console.log(e);
  }
  await atem.setAuxSource(MULTI_VIEWER_INPUT, 2);
};
