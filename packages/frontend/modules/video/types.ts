import { OrganizationData } from "modules/organization/resources/Organization";

export type VideoData = {
  id: number;
  name: string;
  header: string;
  organization: OrganizationData;
  ogvUrl: string;
  createdTime: string;
  files: {
    largeThumb: string;
  };
};
