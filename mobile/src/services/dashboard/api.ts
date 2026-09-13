import { api } from "@/services/api-client";
import { OverviewResponse } from "./types";

export const getOverviewApi = async () => {
  const { data } = await api.get<OverviewResponse>("/dashboard");
  return data;
};
