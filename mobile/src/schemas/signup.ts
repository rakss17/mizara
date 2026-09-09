import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().nonempty("Please enter your first name."),
    lastName: z.string().nonempty("Please enter your last name."),
    email: z
      .string()
      .nonempty("Please enter your valid email address.")
      .email("Please enter your valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/\d/, "Password must contain at least 1 number.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/`~;'+=]/,
        "Password must contain at least 1 special character (!@#$%^&*).",
      ),
    confirmPassword: z.string().nonempty("Please confirm your password."),
    isAgreed: z.boolean().refine((value) => value === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
