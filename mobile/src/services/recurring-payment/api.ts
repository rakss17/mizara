import { api } from "@/services/api-client";
import {
  CreateRecurringPaymentPayload,
  CreateRecurringPaymentResponse,
  FindAllRecurringPaymentParams,
  FindAllRecurringPaymentResponse,
} from "./types";

export const getRecurringPaymentsApi = async (
  params: FindAllRecurringPaymentParams,
) => {
  const { data } = await api.get<FindAllRecurringPaymentResponse>(
    "/recurring-payment",
    { params },
  );
  return data;
};

export const createRecurringPaymentApi = async (
  payload: CreateRecurringPaymentPayload,
) => {
  const { data } = await api.post<CreateRecurringPaymentResponse>(
    "/recurring-payment",
    payload,
  );
  return data;
};
