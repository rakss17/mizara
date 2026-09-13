import { api } from "@/services/api-client";
import {
  LogoutPayload,
  LogoutResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
} from "./types";

export const signInApi = async (payload: SignInPayload) => {
  const { data } = await api.post<SignInResponse>("/auth/signin", payload);
  return data;
};

export const signUpApi = async (payload: SignUpPayload) => {
  const { data } = await api.post<SignUpResponse>("/auth/signup", payload);
  return data;
};

export const logoutApi = async (payload: LogoutPayload) => {
  const { data } = await api.post<LogoutResponse>("/auth/logout", payload);
  return data;
};
