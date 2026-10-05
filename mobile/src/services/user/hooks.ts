import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyProfileApi, getUserSettingsApi, updateMyProfileApi } from "./api";
import { getErrorMessage } from "../get-error-message";

export const useMyProfile = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfileApi(),
  });

  const errorMessage = getErrorMessage(error);

  return {
    myProfile: data?.data,
    isPending,
    errorMessage,
  };
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateMyProfile,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateMyProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-profile"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { updateMyProfile, isPending, errorMessage };
};

export const useUserSettings = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => getUserSettingsApi(),
  });

  const errorMessage = getErrorMessage(error);

  return {
    userSettings: data?.data,
    isPending,
    errorMessage,
  };
};
