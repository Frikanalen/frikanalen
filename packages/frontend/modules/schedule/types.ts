export type Organization = {
  id: number;
  name: string;
};

export type Video = {
  id: number;
  name: string;
  organization: Organization;
};

export type ScheduleItem = {
  id: number;
  video: Video;
  starttime: string;
  endtime: string;
};
