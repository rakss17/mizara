import { isAxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong.",
) => {
  if (!error) return null;

  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (message) return message;
  }

  return fallback;
};
