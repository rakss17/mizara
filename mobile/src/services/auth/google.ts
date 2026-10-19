import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

// The native module is missing in Expo Go, and the free version of the
// library has no web support, so Google sign-in only runs in a dev or
// release build.
export const isGoogleSignInAvailable =
  Platform.OS !== "web" &&
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

// Imported lazily so that merely loading this file in Expo Go does not
// crash on the missing native module.
const loadGoogleSignin = async () => {
  const module = await import("@react-native-google-signin/google-signin");

  module.GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  return module;
};

/**
 * Opens the native Google account picker and returns the ID token for the
 * backend, or null if the user backed out.
 */
export const getGoogleIdToken = async (): Promise<string | null> => {
  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } =
    await loadGoogleSignin();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) return null;

    if (!response.data.idToken) {
      throw new Error("Google did not return an ID token.");
    }

    return response.data.idToken;
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.IN_PROGRESS) {
      return null;
    }
    throw error;
  }
};

export const signOutOfGoogle = async () => {
  if (!isGoogleSignInAvailable) return;

  try {
    const { GoogleSignin } = await loadGoogleSignin();
    await GoogleSignin.signOut();
  } catch {
    // Not signed in with Google, nothing to clear.
  }
};
