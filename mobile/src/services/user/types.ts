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
