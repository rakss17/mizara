export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type GetMyProfileResponse = {
  message: string;
  data: User;
};

export type UpdateMyProfilePayload = {
  first_name?: string;
  last_name?: string;
};

export type UpdateMyProfileResponse = {
  message: string;
};

export type GetUserSettingsResponse = {
  message: string;
  data: {
    id: string;
    user_id: string;
    currency: {
      key: string;
      name: string;
    };
    timezone: {
      key: string;
      name: string;
    };
    theme: {
      key: string;
      name: string;
    };
    email_notifications_enabled: boolean;
    push_notifications_enabled: boolean;
  };
};

export type KeyedOption = {
  key: string;
  name: string;
};

export type UpdateUserSettingsPayload = {
  currency?: string;
  timezone?: string;
  theme?: string;
  push_notifications_enabled?: boolean;
  email_notifications_enabled?: boolean;
};

export type UpdateUserSettingsResponse = {
  message: string;
};

export type GetUserSettingsOptionsResponse = {
  message: string;
  data: {
    currencies: KeyedOption[];
    timezones: KeyedOption[];
    themes: KeyedOption[];
  };
};
