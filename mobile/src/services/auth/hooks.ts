import { useMutation } from "@tanstack/react-query";

import { signIn } from "@/services/auth/api";
import { saveAccessToken } from "@/services/auth/token-storage";

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
    onSuccess: async ({ data }) => {
      await saveAccessToken(data.accessToken);
    },
  });
};
