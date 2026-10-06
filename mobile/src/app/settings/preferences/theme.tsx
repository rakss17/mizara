import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import CheckIcon from "@/assets/icons/check.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import {
  isThemeMode,
  useTheme,
  type ThemeMode,
} from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { SettingsSkeleton } from "@/components/Skeleton";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import {
  useUpdateUserSettings,
  useUserSettingsOptions,
} from "@/services/user/hooks";

const THEME_DESCRIPTIONS: Record<ThemeMode, string> = {
  light: "Always use the light theme",
  dark: "Always use the dark theme",
  system: "Match your device's appearance",
};

export default function ThemePreference() {
  const router = useRouter();
  const FontSizes = useTypography();
  const { colors, themeMode, setThemeMode } = useTheme();
  const { showToast } = useToast();
  const { width, height } = useWindowDimensions();
  const {
    userSettingsOptions,
    isPending: isOptionsLoading,
    errorMessage: optionsErrorMessage,
  } = useUserSettingsOptions();
  const { updateUserSettings } = useUpdateUserSettings();

  // Applied instantly and stored on device; the server sync runs in the
  // background and a failure doesn't revert the visible theme.
  const onSelect = (mode: ThemeMode) => {
    if (mode === themeMode) return;

    setThemeMode(mode);
    updateUserSettings(
      { theme: mode },
      {
        onError: () => showToast("Couldn't sync theme.", "error"),
      },
    );
  };

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: colors.background,
          justifyContent: "flex-start",
          paddingTop: height * 0.02,
          paddingBottom: height * 0.03,
        },
      ]}
    >
      <View
        style={[
          Styles.flexRow,
          {
            width: width * SCREEN_WIDTH_RATIO,
            gap: 10,
            justifyContent: "space-between",
            paddingBottom: height * 0.02,
          },
        ]}
      >
        <TouchableOpacity style={{ width: 24 }} onPress={() => router.back()}>
          <ArrowLeftIcon color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.large,
          }}
        >
          Theme
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {isOptionsLoading ? (
        <View style={{ width: width * SCREEN_WIDTH_RATIO, gap: 10 }}>
          <SettingsSkeleton />
          <SettingsSkeleton />
          <SettingsSkeleton />
        </View>
      ) : optionsErrorMessage || !userSettingsOptions ? (
        <Text
          style={{
            color: colors.danger,
            fontWeight: FontWeights.medium,
            fontSize: FontSizes.small,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {optionsErrorMessage ?? "Theme options not found."}
        </Text>
      ) : (
        <ScrollView
          style={{ flex: 1, width: width * 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              overflow: "hidden",
            }}
          >
            {userSettingsOptions.themes.map((option) => {
              if (!isThemeMode(option.key)) return null;

              const mode = option.key;
              const isSelected = themeMode === mode;

              return (
                <TouchableOpacity
                  key={mode}
                  onPress={() => onSelect(mode)}
                  style={[
                    Styles.flexRow,
                    {
                      justifyContent: "space-between",
                      paddingVertical: 20,
                      paddingHorizontal: 30,
                    },
                  ]}
                >
                  <View style={{ gap: 2 }}>
                    <Text
                      style={{
                        color: isSelected
                          ? colors.primary
                          : colors.textSecondary,
                        fontWeight: FontWeights.semibold,
                        fontSize: FontSizes.medium,
                      }}
                    >
                      {option.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontSize: FontSizes.tiny,
                      }}
                    >
                      {THEME_DESCRIPTIONS[mode]}
                    </Text>
                  </View>
                  {isSelected && (
                    <CheckIcon width={24} height={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
