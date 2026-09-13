import { useMutation } from "@tanstack/react-query";

import { signInApi, signUpApi } from "@/services/auth/api";
import { saveAccessToken } from "@/services/auth/token-storage";
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
    },
  });

  const errorMessage = getErrorMessage(error);

  return { signIn, isPending, isSuccess, errorMessage };
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
