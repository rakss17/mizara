import { api } from "@/services/api-client";
import { GetMyProfileResponse, GetUserSettingsResponse } from "./types";

export const getMyProfileApi = async () => {
  const { data } = await api.get<GetMyProfileResponse>("/user/me");
  return data;
};

export const getUserSettingsApi = async () => {
  const { data } = await api.get<GetUserSettingsResponse>("/user/me/settings");
  return data;
};
