import { useQuery } from "@tanstack/react-query";

import { getRecurringPaymentsApi } from "@/services/recurring-payment/api";
import { getErrorMessage } from "@/services/get-error-message";
import { FindAllRecurringPaymentParams } from "./types";

export const useRecurringPayments = (
  params: FindAllRecurringPaymentParams,
) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["recurring-payments", params],
    queryFn: () => getRecurringPaymentsApi(params),
  });

  const errorMessage = getErrorMessage(error);

  return {
    recurringPayments: data?.data ?? [],
    metadata: data?.metadata,
    isPending,
    errorMessage,
  };
};
