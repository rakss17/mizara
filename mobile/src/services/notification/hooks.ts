import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteNotificationApi,
  getNotificationsApi,
  getUnreadNotificationCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "@/services/notification/api";
import { getErrorMessage } from "@/services/get-error-message";
import { FindAllNotificationParams } from "./types";

export const useNotifications = (
  params: Omit<FindAllNotificationParams, "page"> = {},
) => {
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["notifications", params],
    queryFn: ({ pageParam }) =>
      getNotificationsApi({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.page < lastPage.metadata.totalPages
        ? lastPage.metadata.page + 1
        : undefined,
  });

  const errorMessage = getErrorMessage(error);

  return {
    notifications: data?.pages.flatMap((page) => page.data) ?? [],
    metadata: data?.pages.at(-1)?.metadata,
    isPending,
    errorMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export const useUnreadNotificationCount = () => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadNotificationCountApi,
  });

  const errorMessage = getErrorMessage(error);

  return {
    unreadCount: data?.data.unread_count ?? 0,
    isPending,
    errorMessage,
    refetch,
  };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  const {
    mutate: markNotificationAsRead,
    isPending,
    error,
  } = useMutation({
    mutationFn: markNotificationAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { markNotificationAsRead, isPending, errorMessage };
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  const {
    mutate: markAllNotificationsAsRead,
    isPending,
    error,
  } = useMutation({
    mutationFn: markAllNotificationsAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { markAllNotificationsAsRead, isPending, errorMessage };
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteNotification,
    isPending,
    error,
  } = useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { deleteNotification, isPending, errorMessage };
};
