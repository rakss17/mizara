import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getRefreshToken } from "@/services/auth/token-storage";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      // The refresh token is the real signal of an active session: it
      // outlives the short-lived access token, which the api-client
      // interceptor will silently renew on the first authenticated request.
      const refreshToken = await getRefreshToken();

      setIsAuthenticated(!!refreshToken);
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/signin" />;
}
