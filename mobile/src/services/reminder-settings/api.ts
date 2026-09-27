import { api } from "@/services/api-client";
import {
  FindReminderSettingsResponse,
  UpsertReminderSettingsPayload,
  UpsertReminderSettingsResponse,
} from "./types";

export const getReminderSettingsApi = async (recurringPaymentId: string) => {
  const { data } = await api.get<FindReminderSettingsResponse>(
    `/recurring-payment/${recurringPaymentId}/reminder-settings`,
  );
  return data;
};

export const upsertReminderSettingsApi = async ({
  recurringPaymentId,
  payload,
}: {
  recurringPaymentId: string;
  payload: UpsertReminderSettingsPayload;
}) => {
  const { data } = await api.put<UpsertReminderSettingsResponse>(
    `/recurring-payment/${recurringPaymentId}/reminder-settings`,
    payload,
  );
  return data;
};

