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

    console.log("HIII")
    await atem.setMultiViewerSource({source: 1, windowIndex: 2});
    await atem.setMultiViewerSource({source: 2, windowIndex: 3});
    await atem.setMultiViewerSource({source: 3, windowIndex: 4});
    await atem.setMultiViewerSource({source: 4, windowIndex: 5});
    await atem.setMultiViewerSource({source: 5, windowIndex: 6});
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
