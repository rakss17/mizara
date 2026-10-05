import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile/edit" options={{ presentation: "modal" }} />
    </Stack>
  );
}
