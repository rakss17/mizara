import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";
import { useTheme, type ThemeMode } from "@/contexts/ThemeContext";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";

const THEME_OPTIONS: { mode: ThemeMode; label: string; description: string }[] = [
  {
    mode: "light",
    label: "Light",
    description: "Always use the light theme",
  },
  {
    mode: "dark",
    label: "Dark",
    description: "Always use the dark theme",
  },
  {
    mode: "system",
    label: "System",
    description: "Match your device's appearance",
  },
];

export default function Settings() {
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + height * 0.02,
          justifyContent: "flex-start",
        },
      ]}
    >
      <View style={{ width: width * SCREEN_WIDTH_RATIO }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.xLarge,
          }}
        >
          Settings
        </Text>
      </View>

      <View
        style={{
          width: width * SCREEN_WIDTH_RATIO,
          marginTop: height * 0.035,
        }}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontWeight: FontWeights.semibold,
            fontSize: FontSizes.small,
            marginBottom: height * 0.01,
          }}
        >
          THEME
        </Text>

        <View
          style={{
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: colors.surface,
            overflow: "hidden",
          }}
        >
          {THEME_OPTIONS.map((option, index) => {
            const isSelected = themeMode === option.mode;

            return (
              <TouchableOpacity
                key={option.mode}
                onPress={() => setThemeMode(option.mode)}
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                    paddingHorizontal: 15,
                    paddingVertical: 14,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <View style={{ gap: 2 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: FontWeights.semibold,
                      fontSize: FontSizes.medium,
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: FontSizes.tiny,
                    }}
                  >
                    {option.description}
                  </Text>
                </View>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.primary,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: FontSizes.tiny,
            marginTop: height * 0.015,
            textAlign: "center",
          }}
        >
          More settings coming soon.
        </Text>
      </View>
    </View>
  );
}
