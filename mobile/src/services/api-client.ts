import axios from "axios";
import { router } from "expo-router";

import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/services/auth/token-storage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate instance (no interceptors) so refreshing the access token never
// triggers the response interceptor below and recurses.
const refreshClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Endpoints that are either unauthenticated or already part of the
// refresh/logout flow itself — a 401 from these should never trigger a
// refresh attempt or a redirect.
const AUTH_ENDPOINTS = [
  "/auth/signin",
  "/auth/signup",
  "/auth/refresh",
  "/auth/logout",
];

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const { data } = await refreshClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    await saveAccessToken(data.data.accessToken);
    await saveRefreshToken(data.data.refreshToken);

    return data.data.accessToken as string;
  } catch {
    await deleteAccessToken();
    await deleteRefreshToken();

    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      originalRequest?.url?.includes(endpoint),
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      // Refresh token is missing, expired, or revoked - the session is
      // over, so bounce back to sign in instead of letting the caller
      // surface a raw 401.
      router.replace("/signin");
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);
