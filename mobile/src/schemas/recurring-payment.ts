import { z } from "zod";

export const RECURRING_PAYMENT_TYPES = ["Subscription", "Bills"] as const;

export const RECURRING_PAYMENT_BILLING_CYCLES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const;

export const RECURRING_PAYMENT_PRICING_TYPES = ["Fixed", "Variable"] as const;

export const RECURRING_PAYMENT_DUE_DATE_TYPES = ["Fixed", "Variable"] as const;

export const REMINDER_CHANNELS = ["push", "email"] as const;

export const REMINDER_CHANNEL_LABELS: Record<
  (typeof REMINDER_CHANNELS)[number],
  string
> = {
  push: "Push Notifications",
  email: "Email",
};

export const REMINDER_OFFSET_DAYS = [7, 3, 1, 0] as const;

export const REMINDER_OFFSET_DAY_LABELS: Record<
  (typeof REMINDER_OFFSET_DAYS)[number],
  string
> = {
  7: "7 days before",
  3: "3 days before",
  1: "1 day before",
  0: "Due day",
};

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
  pricing_type: z.enum(RECURRING_PAYMENT_PRICING_TYPES, {
    message: "Please select a pricing type.",
  }),
  billing_date: z.date().optional(),
  due_date_type: z.enum(RECURRING_PAYMENT_DUE_DATE_TYPES, {
    message: "Please select a due date type.",
  }),
  category_id: z.string().nonempty("Please select a category."),
  reminder_channels: z
    .array(z.enum(REMINDER_CHANNELS))
    .min(1, "Select at least one notification channel."),
  reminder_remind_before_days: z
    .array(z.union([z.literal(7), z.literal(3), z.literal(1), z.literal(0)]))
    .min(1, "Select at least one reminder timing."),
});

export type CreateRecurringPaymentFormData = z.infer<
  typeof createRecurringPaymentSchema
>;
