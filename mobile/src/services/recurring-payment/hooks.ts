import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRecurringPaymentApi,
  getRecurringPaymentsApi,
} from "@/services/recurring-payment/api";
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

export const useCreateRecurringPayment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createRecurringPayment,
    isPending,
    error,
  } = useMutation({
    mutationFn: createRecurringPaymentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-payments"] });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { createRecurringPayment, isPending, errorMessage };
};
