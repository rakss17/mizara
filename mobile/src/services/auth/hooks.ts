import { useMutation } from "@tanstack/react-query";

import { signInApi } from "@/services/auth/api";
import { saveAccessToken } from "@/services/auth/token-storage";
import { getErrorMessage } from "../get-error-message";

export const useSignIn = () => {
  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: signInApi,
    onSuccess: async ({ data }) => {
      await saveAccessToken(data.accessToken);
    },
  });

  const errorMessage = getErrorMessage(error);

  return { signIn, isPending, errorMessage };
};
