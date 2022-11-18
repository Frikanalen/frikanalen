import type { Atem } from "atem-connection";
import { AudioMixOption } from "atem-connection/dist/enums/index.js";
import { MULTI_VIEWER_INPUT } from "../server.js";

/**
 * Apply initial state to the ATEM mixer.
 *
 * @param atem - ATEM mixer instance.
 */
export const applyInitialConfiguration = async (atem: Atem) => {
  const afv = AudioMixOption.AudioFollowVideo;

  await atem.setMultiViewerWindowSource(2, 0, 3);
  await atem.setMultiViewerWindowSource(1, 0, 2);
  await atem.setMultiViewerWindowSource(3, 0, 4);
  await atem.setMultiViewerWindowSource(4, 0, 5);
  await atem.setMultiViewerWindowSource(5, 0, 6);
  try {
    await atem.setClassicAudioMixerInputProps(1, { mixOption: afv });
    await atem.setClassicAudioMixerInputProps(2, { mixOption: afv });
    await atem.setClassicAudioMixerInputProps(3, { mixOption: afv });
    await atem.setClassicAudioMixerInputProps(4, { mixOption: afv });
    await atem.setClassicAudioMixerInputProps(5, { mixOption: afv });
  } catch (e) {
    console.log("got exception while setting audio mixer input props");
    console.log(e);
  }
  await atem.setAuxSource(MULTI_VIEWER_INPUT, 0);
};
