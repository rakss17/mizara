import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMyProfileApi,
  getUserSettingsApi,
  getUserSettingsOptionsApi,
  updateMyProfileApi,
  updateUserSettingsApi,
} from "./api";
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

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateUserSettings,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateUserSettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });
    },
  });

  const errorMessage = getErrorMessage(error);

  return { updateUserSettings, isPending, errorMessage };
};

export const useUserSettingsOptions = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["user-settings-options"],
    queryFn: () => getUserSettingsOptionsApi(),
    staleTime: Infinity,
  });

  const errorMessage = getErrorMessage(error);

  return {
    userSettingsOptions: data?.data,
    isPending,
    errorMessage,
  };
};
