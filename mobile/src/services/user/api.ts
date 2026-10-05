import { api } from "@/services/api-client";
import {
  GetMyProfileResponse,
  GetUserSettingsOptionsResponse,
  GetUserSettingsResponse,
  UpdateMyProfilePayload,
  UpdateMyProfileResponse,
  UpdateUserSettingsPayload,
  UpdateUserSettingsResponse,
} from "./types";

export const getMyProfileApi = async () => {
  const { data } = await api.get<GetMyProfileResponse>("/user/me");
  return data;
};

export const updateMyProfileApi = async (payload: UpdateMyProfilePayload) => {
  const { data } = await api.patch<UpdateMyProfileResponse>(
    "/user/me",
    payload,
  );
  return data;
};

export const getUserSettingsApi = async () => {
  const { data } = await api.get<GetUserSettingsResponse>("/user/me/settings");
  return data;
};

export const updateUserSettingsApi = async (
  payload: UpdateUserSettingsPayload,
) => {
  const { data } = await api.patch<UpdateUserSettingsResponse>(
    "/user/me/settings",
    payload,
  );
  return data;
};

export const getUserSettingsOptionsApi = async () => {
  const { data } = await api.get<GetUserSettingsOptionsResponse>(
    "/user/me/settings/options",
  );
  return data;
};
