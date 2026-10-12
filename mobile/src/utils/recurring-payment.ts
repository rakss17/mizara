import { RecurringPaymentStatus } from "@/components/RecurringPaymentsFilterModal";
import type { ThemeColors } from "@/styles/colors";
import type { RecurringPayment } from "@/services/recurring-payment/types";

const MONTH_ABBREVIATIONS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];

export const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  return `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getDaysUntilDue = (dueDate: string) => {
  const due = new Date(dueDate);
  const today = new Date();

  const dueDateOnly = Date.UTC(
    due.getFullYear(),
    due.getMonth(),
    due.getDate(),
  );
  const todayDateOnly = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return Math.round((dueDateOnly - todayDateOnly) / (1000 * 60 * 60 * 24));
};

export const formatDueStatus = (dueDate: string) => {
  const daysLeft = getDaysUntilDue(dueDate);

  if (daysLeft < 0) return "Overdue";
  if (daysLeft === 0) return "Due Today";
  if (daysLeft === 1) return "Due Tomorrow";
  return `Due in ${daysLeft} days`;
};

export const getDueStatusColor = (
  dueDate: string,
  colors: ThemeColors,
  status: RecurringPaymentStatus,
) => {
  const daysLeft = getDaysUntilDue(dueDate);

  if (status === "Archived") return colors.textMuted;
  if (daysLeft <= 1) return colors.danger;
  if (daysLeft <= 7) return colors.warning;
  return colors.textSecondary;
};

export const formatAmount = (amount: string) => {
  const value = Number(amount);
  return `P${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};

// After a rollover the new dates are only expected - ask for confirmation
// once the billing date arrives, when the user has the actual bill.
export const isCycleConfirmationReady = (
  recurringPayment: Pick<
    RecurringPayment,
    "needs_cycle_confirmation" | "is_archived" | "billing_date"
  >,
) =>
  recurringPayment.needs_cycle_confirmation &&
  !recurringPayment.is_archived &&
  (!recurringPayment.billing_date ||
    getDaysUntilDue(recurringPayment.billing_date) <= 0);

export const getStartOfTomorrow = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
};
