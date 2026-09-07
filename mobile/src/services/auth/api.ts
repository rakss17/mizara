import { api } from "@/services/api-client";
import { SignInPayload, SignInResponse } from "./types";

export const signInApi = async (payload: SignInPayload) => {
  const { data } = await api.post<SignInResponse>("/auth/signin", payload);
  return data;
};
