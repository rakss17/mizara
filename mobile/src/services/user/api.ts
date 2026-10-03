import { api } from "@/services/api-client";
import { GetMyProfileResponse } from "./types";

export const getMyProfileApi = async () => {
  const { data } = await api.get<GetMyProfileResponse>("/user/me");
  return data;
};
