import { api } from "@/services/api-client";

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

export const signIn = async (payload: SignInPayload) => {
  const { data } = await api.post<SignInResponse>("/auth/signin", payload);
  return data;
};
