export type ReminderChannel = "push" | "email";

export type ReminderOffsetDay = 7 | 3 | 1 | 0;

export type ReminderSettings = {
  id: string;
  recurring_payment_id: string;
  is_enabled: boolean;
  remind_before_days: ReminderOffsetDay[];
  channels: ReminderChannel[];
  created_at: string;
  updated_at: string;
};

export type UpsertReminderSettingsPayload = {
  is_enabled: boolean;
  remind_before_days: ReminderOffsetDay[];
  channels: ReminderChannel[];
};

export type FindReminderSettingsResponse = {
  message: string;
  data: ReminderSettings;
};

export type UpsertReminderSettingsResponse = {
  message: string;
};
