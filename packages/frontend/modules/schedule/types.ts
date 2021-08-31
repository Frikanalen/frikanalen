import { Video } from "modules/video/types";

export type Organization = {
  id: number;
  name: string;
};

export type ScheduleItem = {
  id: number;
  video: Video;
  starttime: string;
  endtime: string;
};
