import { api } from "@/services/api-client";
import {
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
