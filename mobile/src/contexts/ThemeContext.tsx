import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as SystemUI from "expo-system-ui";

import { Colors, type ColorScheme, type ThemeColors } from "@/styles/colors";

export type ThemeMode = "light" | "dark" | "system";

const THEME_MODE_KEY = "themeMode";

type ThemeContextValue = {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    SecureStore.getItemAsync(THEME_MODE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeModeState(stored);
      }
    });
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    SecureStore.setItemAsync(THEME_MODE_KEY, mode);
  };

  const colorScheme: ColorScheme =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors[colorScheme].background);
  }, [colorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      colorScheme,
      colors: Colors[colorScheme],
      setThemeMode,
    }),
    [themeMode, colorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
