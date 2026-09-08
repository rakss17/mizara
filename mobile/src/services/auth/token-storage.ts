import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";

export const saveAccessToken = (token: string) =>
  SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);

export const getAccessToken = () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

export const deleteAccessToken = () =>
  SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
