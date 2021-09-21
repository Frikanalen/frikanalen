import { VideoData } from "modules/video/types";

export type ScheduleItem = {
  id: number;
  video: VideoData;
  starttime: string;
  endtime: string;
};
