import { VideoData } from "modules/video/types";

export type Organization = {
  id: number;
  name: string;
};

export type ScheduleItem = {
  id: number;
  video: VideoData;
  starttime: string;
  endtime: string;
};
