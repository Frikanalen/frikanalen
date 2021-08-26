import { z } from "zod";

export const userSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  isStaff: z.boolean(),
  dateJoined: z.string(),
  id: z.number(),
  dateOfBirth: z.string(),
  //organizationRoles: z.array(fkOrgRoleSchema),
});

export type User = z.infer<typeof userSchema>;
