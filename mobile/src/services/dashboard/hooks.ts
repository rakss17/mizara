import { useQuery } from "@tanstack/react-query";

import { getOverviewApi } from "@/services/dashboard/api";
import { getErrorMessage } from "@/services/get-error-message";

export const useOverview = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getOverviewApi,
  });

  const errorMessage = getErrorMessage(error);

  return { overview: data?.data, isPending, errorMessage };
};
