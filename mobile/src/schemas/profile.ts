import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().nonempty("Please enter your first name."),
  lastName: z.string().trim().nonempty("Please enter your last name."),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
