export type OrganizationRole = {
  role: string;
  organizationId: number;
  organizationName: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isStaff: string;
  dateJoined: string;
  dateOfBirth: string;
  organizationRoles: OrganizationRole[];
};
