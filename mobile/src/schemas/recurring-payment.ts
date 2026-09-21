import { z } from "zod";

export const RECURRING_PAYMENT_TYPES = ["Subscription", "Bills"] as const;

export const RECURRING_PAYMENT_BILLING_CYCLES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const;

export const createRecurringPaymentSchema = z.object({
  name: z.string().nonempty("Please enter a name."),
  type: z.enum(RECURRING_PAYMENT_TYPES, {
    message: "Please select a type.",
  }),
  description: z.string().optional(),
  amount: z
    .string()
    .nonempty("Please enter an amount.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Please enter a valid amount.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Amount must be greater than 0.",
    }),
  billing_cycle: z.enum(RECURRING_PAYMENT_BILLING_CYCLES, {
    message: "Please select a billing cycle.",
  }),
  is_auto_renew: z.boolean(),
  is_free_trial: z.boolean(),
  due_date: z.date({ message: "Please select a due date." }),
  category_id: z.string().nonempty("Please select a category."),
});

export type CreateRecurringPaymentFormData = z.infer<
  typeof createRecurringPaymentSchema
>;
