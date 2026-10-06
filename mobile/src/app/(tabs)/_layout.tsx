import { useEffect } from "react";
import { Tabs } from "expo-router";

import HomeIcon from "@/assets/icons/home.svg";
import WalletCardsIcon from "@/assets/icons/wallet-cards.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import { isThemeMode, useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import { useUserSettings } from "@/services/user/hooks";

export default function TabsLayout() {
  const { colors, hasStoredThemeMode, setThemeMode } = useTheme();
  const FontSizes = useTypography();
  const { userSettings } = useUserSettings();

  // Fresh install / new device: adopt the account's theme. A theme already
  // chosen on this device always wins.
  const serverTheme = userSettings?.theme.key;
  useEffect(() => {
    if (hasStoredThemeMode === false && isThemeMode(serverTheme)) {
      setThemeMode(serverTheme);
    }
  }, [hasStoredThemeMode, serverTheme, setThemeMode]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          borderTopWidth: 2,
          backgroundColor: colors.background,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSizes.tiny,
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
      <Tabs.Screen
        name="recurring-payments"
        options={{
          title: "Recurring Payments",
          tabBarIcon: ({ color }) => <WalletCardsIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
