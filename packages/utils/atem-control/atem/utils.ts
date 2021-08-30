import { Atem } from "atem-connection";
import { AudioMixOption } from "atem-connection/dist/enums";
import { MULTI_VIEWER_INPUT } from "../server";

/**
 * Apply initial state to the ATEM mixer.
 *
 * @param atem - ATEM mixer instance.
 */
export const applyInitialConfiguration = async (atem: Atem) => {
  const afv = AudioMixOption.AudioFollowVideo;

  await atem.setAudioMixerInputProps(1, { mixOption: afv });
  await atem.setAudioMixerInputProps(2, { mixOption: afv });
  await atem.setAudioMixerInputProps(3, { mixOption: afv });
  await atem.setAudioMixerInputProps(4, { mixOption: afv });

  await atem.setAuxSource(MULTI_VIEWER_INPUT, 2);
};
