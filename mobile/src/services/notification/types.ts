export type NotificationType =
  | "due"
  | "overdue"
  | "cycle_confirmation"
  | "payment_archived"
  | "free_trial_ending_soon"
  | "free_trial_ended"
  | "free_trial_converted_to_paid";

export type Notification = {
  id: string;
  user_id: string;
  recurring_payment_id: string | null;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FindAllNotificationParams = {
  page?: number;
  limit?: number;
  is_read?: boolean;
};

export type FindAllNotificationResponse = {
  message: string;
  data: Notification[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type UnreadNotificationCountResponse = {
  message: string;
  data: {
    unread_count: number;
  };
};

export type MarkNotificationAsReadResponse = {
  message: string;
  data: Notification;
};

export type MarkAllNotificationsAsReadResponse = {
  message: string;
  data: {
    updated_count: number;
  };
};

export type DeleteNotificationResponse = {
  message: string;
};
