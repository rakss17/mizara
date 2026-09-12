import { Tabs } from "expo-router";

import HomeIcon from "@/assets/icons/home.svg";
import { Colors } from "@/styles/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          borderTopColor: Colors.border,
          borderTopWidth: 2,
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
