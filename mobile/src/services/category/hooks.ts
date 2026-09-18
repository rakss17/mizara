import { useQuery } from "@tanstack/react-query";

import { getCategoriesApi } from "@/services/category/api";
import { getErrorMessage } from "@/services/get-error-message";

export const useCategories = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const errorMessage = getErrorMessage(error);

  return { categories: data?.data ?? [], isPending, errorMessage };
};
