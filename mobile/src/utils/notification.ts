import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

import CalendarDaysIcon from "@/assets/icons/calendar-days.svg";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg";
import SquarePenIcon from "@/assets/icons/square-pen.svg";
import CircleXIcon from "@/assets/icons/circle-x.svg";
import HourglassIcon from "@/assets/icons/hourglass.svg";
import BanknoteIcon from "@/assets/icons/banknote.svg";
import type { ThemeColors } from "@/styles/colors";
import type { NotificationType } from "@/services/notification/types";
import { formatDueDate } from "@/utils/recurring-payment";

export const getNotificationAppearance = (
  type: NotificationType,
  colors: ThemeColors,
): { Icon: FC<SvgProps>; color: string; backgroundColor: string } => {
  switch (type) {
    case "overdue":
      return {
        Icon: TriangleAlertIcon,
        color: colors.danger,
        backgroundColor: colors.dangerBg,
      };
    case "cycle_confirmation":
      return {
        Icon: SquarePenIcon,
        color: colors.overviewFontPurple,
        backgroundColor: colors.overviewBgPurple,
      };
    case "payment_archived":
    case "free_trial_ended":
      return {
        Icon: CircleXIcon,
        color: colors.textSecondary,
        backgroundColor: colors.backgroundMuted,
      };
    case "free_trial_ending_soon":
      return {
        Icon: HourglassIcon,
        color: colors.overviewFontYellow,
        backgroundColor: colors.overviewBgYellow,
      };
    case "free_trial_converted_to_paid":
      return {
        Icon: BanknoteIcon,
        color: colors.success,
        backgroundColor: colors.successBg,
      };
    case "due":
    default:
      return {
        Icon: CalendarDaysIcon,
        color: colors.info,
        backgroundColor: colors.infoBg,
      };
  }
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// "Just now", "5m ago", "3h ago", "2d ago", then the date after a week.
export const formatNotificationTime = (createdAt: string) => {
  const elapsed = Date.now() - new Date(createdAt).getTime();

  if (elapsed < MINUTE) return "Just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d ago`;
  return formatDueDate(createdAt);
};

export const formatUnreadBadge = (unreadCount: number) =>
  unreadCount > 99 ? "99+" : unreadCount;
