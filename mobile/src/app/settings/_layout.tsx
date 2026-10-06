import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile/edit" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="preferences/currency"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="preferences/timezone"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}
