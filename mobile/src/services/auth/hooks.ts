import { useMutation } from "@tanstack/react-query";

import { logoutApi, signInApi, signUpApi } from "@/services/auth/api";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/services/auth/token-storage";
import { getErrorMessage } from "../get-error-message";

export const useSignIn = () => {
  const {
    mutate: signIn,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: signInApi,
    onSuccess: async ({ data }) => {
      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
    },
  });

  const errorMessage = getErrorMessage(error);

  return { signIn, isPending, isSuccess, errorMessage };
};

export const useSignOut = () => {
  const {
    mutate: signOut,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await logoutApi({ refresh_token: refreshToken });
      }
    },
    onSettled: async () => {
      await deleteAccessToken();
      await deleteRefreshToken();
    },
  });

  const errorMessage = getErrorMessage(error);

  return { signOut, isPending, errorMessage };
};

export const useSignUp = () => {
  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUpApi,
  });

  const errorMessage = getErrorMessage(error);

  return { signUp, isPending, errorMessage };
};
