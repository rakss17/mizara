import { api } from "@/services/api-client";
import {
  GetMyProfileResponse,
  GetUserSettingsResponse,
  UpdateMyProfilePayload,
  UpdateMyProfileResponse,
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
