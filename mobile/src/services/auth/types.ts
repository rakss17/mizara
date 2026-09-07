export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResponse = {
  message: string;
  data: {
    accessToken: string;
  };
};
