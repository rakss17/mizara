import { api } from "@/services/api-client";
import {
  DeleteNotificationResponse,
  FindAllNotificationParams,
  FindAllNotificationResponse,
  MarkAllNotificationsAsReadResponse,
  MarkNotificationAsReadResponse,
  UnreadNotificationCountResponse,
} from "./types";

export const getNotificationsApi = async (
  params: FindAllNotificationParams,
) => {
  const { data } = await api.get<FindAllNotificationResponse>("/notification", {
    params,
  });
  return data;
};

export const getUnreadNotificationCountApi = async () => {
  const { data } = await api.get<UnreadNotificationCountResponse>(
    "/notification/unread-count",
  );
  return data;
};

export const markNotificationAsReadApi = async (id: string) => {
  const { data } = await api.patch<MarkNotificationAsReadResponse>(
    `/notification/${id}/read`,
  );
  return data;
};

export const markAllNotificationsAsReadApi = async () => {
  const { data } = await api.patch<MarkAllNotificationsAsReadResponse>(
    "/notification/read-all",
  );
  return data;
};

export const deleteNotificationApi = async (id: string) => {
  const { data } = await api.delete<DeleteNotificationResponse>(
    `/notification/${id}`,
  );
  return data;
};
