import { Organization } from "modules/schedule/types";

export type Video = {
  id: number;
  name: string;
  header: string;
  organization: Organization;
};
