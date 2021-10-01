import { Resource, ResourceFactory } from "modules/state/classes/Resource";

export type OrganizationData = {
  id: number;
  name: string;
  description: string;
  postalAddress: string;
  streetAddress: string;

  // Temporary
  editorId: number;
  editorName: string;
  editorEmail: string;
  editorMsisdn: string;
};

export class Organization extends Resource<OrganizationData> {
  public get videos() {
    const { id } = this.data;
    const { listStore } = this.manager.stores;

    return listStore.ensure(`videos-organization-${id}`, "video", {
      path: "/videos",
      params: {
        organization: id,
      },
    });
  }
}

export const createOrganization: ResourceFactory<Organization> = (data, manager) => new Organization(data, manager);
