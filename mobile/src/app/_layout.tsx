import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/services/query-client";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function RootNavigator() {
  const { colorScheme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarTranslucent: true,
        navigationBarTranslucent: true,
        statusBarStyle: colorScheme === "dark" ? "light" : "dark",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <RootNavigator />
        </KeyboardProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
