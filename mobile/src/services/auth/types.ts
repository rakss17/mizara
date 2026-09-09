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

export type SignUpPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  statusCode: number;
  message: string;
};
