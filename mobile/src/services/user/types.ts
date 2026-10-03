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
