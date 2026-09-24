import { Stack } from "expo-router";

export default function RecurringPaymentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add" options={{ presentation: "modal" }} />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
