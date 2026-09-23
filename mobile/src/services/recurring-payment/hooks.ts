import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRecurringPaymentApi,
  deleteRecurringPaymentApi,
  getRecurringPaymentApi,
  getRecurringPaymentsApi,
  updateRecurringPaymentApi,
} from "@/services/recurring-payment/api";
import { getErrorMessage } from "@/services/get-error-message";
import { FindAllRecurringPaymentParams } from "./types";

export const useRecurringPayments = (params: FindAllRecurringPaymentParams) => {
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
      queryClient.invalidateQueries({
        queryKey: ["recurring-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { createRecurringPayment, isPending, errorMessage };
};

export const useRecurringPayment = (id: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["recurring-payment", id],
    queryFn: () => getRecurringPaymentApi(id),
    enabled: !!id,
  });

  const errorMessage = getErrorMessage(error);

  return {
    recurringPayment: data?.data,
    isPending,
    errorMessage,
  };
};

export const useUpdateRecurringPayment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateRecurringPayment,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateRecurringPaymentApi,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-payment", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["recurring-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { updateRecurringPayment, isPending, errorMessage };
};

export const useDeleteRecurringPayment = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteRecurringPayment,
    isPending,
    error,
  } = useMutation({
    mutationFn: deleteRecurringPaymentApi,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["recurring-payment", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["recurring-payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { deleteRecurringPayment, isPending, errorMessage };
};
