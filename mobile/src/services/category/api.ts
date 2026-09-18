import { api } from "@/services/api-client";
import { FindAllCategoryResponse } from "./types";

export const getCategoriesApi = async () => {
  const { data } = await api.get<FindAllCategoryResponse>("/category");
  return data;
};
