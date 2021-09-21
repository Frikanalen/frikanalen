import { createVideoList } from "modules/video/lists/createVideoList";

export const lists = {
  video: createVideoList,
};

export type ListType = keyof typeof lists;
