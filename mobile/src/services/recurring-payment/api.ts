import { api } from "@/services/api-client";
import {
  CreateRecurringPaymentPayload,
  CreateRecurringPaymentResponse,
  DeleteRecurringPaymentResponse,
  FindAllRecurringPaymentParams,
  FindAllRecurringPaymentResponse,
  FindOneRecurringPaymentResponse,
  UpdateRecurringPaymentPayload,
  UpdateRecurringPaymentResponse,
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

export const getRecurringPaymentApi = async (id: string) => {
  const { data } = await api.get<FindOneRecurringPaymentResponse>(
    `/recurring-payment/${id}`,
  );
  return data;
};

export const updateRecurringPaymentApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateRecurringPaymentPayload;
}) => {
  const { data } = await api.patch<UpdateRecurringPaymentResponse>(
    `/recurring-payment/${id}`,
    payload,
  );
  return data;
};

export const deleteRecurringPaymentApi = async (id: string) => {
  const { data } = await api.delete<DeleteRecurringPaymentResponse>(
    `/recurring-payment/${id}`,
  );
  return data;
};
