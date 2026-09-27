import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import {
  getReminderSettingsApi,
  upsertReminderSettingsApi,
} from "@/services/reminder-settings/api";
import { getErrorMessage } from "@/services/get-error-message";

const isNotFoundError = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 404;

export const useReminderSettings = (recurringPaymentId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["reminder-settings", recurringPaymentId],
    queryFn: () => getReminderSettingsApi(recurringPaymentId),
    enabled: !!recurringPaymentId,
    retry: (failureCount, err) => !isNotFoundError(err) && failureCount < 3,
  });

  const errorMessage = isNotFoundError(error) ? null : getErrorMessage(error);

  return {
    reminderSettings: data?.data ?? null,
    isPending,
    errorMessage,
  };
};

export const useUpsertReminderSettings = () => {
  const queryClient = useQueryClient();

  const {
    mutate: upsertReminderSettings,
    isPending,
    error,
  } = useMutation({
    mutationFn: upsertReminderSettingsApi,
    onSuccess: (_data, { recurringPaymentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reminder-settings", recurringPaymentId],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { upsertReminderSettings, isPending, errorMessage };
};
