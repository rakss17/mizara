import type { ThemeColors } from "@/styles/colors";

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

export const getDueStatusColor = (dueDate: string, colors: ThemeColors) => {
  const daysLeft = getDaysUntilDue(dueDate);

  if (daysLeft <= 1) return colors.danger;
  if (daysLeft <= 7) return colors.warning;
  return colors.textSecondary;
};

export const formatAmount = (amount: string) => {
  const value = Number(amount);
  return `P${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};
