import { Organization } from "modules/schedule/types";

export type VideoData = {
  id: number;
  name: string;
  header: string;
  organization: Organization;
  ogvUrl: string;
  createdTime: string;
  files: {
    largeThumb: string;
  };
};
