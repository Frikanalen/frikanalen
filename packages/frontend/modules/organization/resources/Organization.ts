import { Resource, ResourceFactory } from "modules/state/classes/Resource";

export type OrganizationData = {
  id: number;
  name: string;
};

export class Organization extends Resource<OrganizationData> {}

export const createOrganization: ResourceFactory<Organization> = (data, manager) => new Organization(data, manager);
