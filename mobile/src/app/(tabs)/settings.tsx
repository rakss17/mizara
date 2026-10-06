import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import NotificationIcon from "@/assets/icons/notification.svg";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";
import { useTheme, type ThemeMode } from "@/contexts/ThemeContext";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { useMyProfile, useUserSettings } from "@/services/user/hooks";
import { SettingsSkeleton } from "@/components/Skeleton";
import { ToggleSwitch } from "@/components/ToggleSwitch";

const THEME_OPTIONS: { mode: ThemeMode; label: string; description: string }[] =
  [
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
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    myProfile,
    isPending: isProfilePending,
    errorMessage: profileErrorMessage,
  } = useMyProfile();
  const {
    userSettings,
    isPending: isSettingsPending,
    errorMessage: settingsErrorMessage,
  } = useUserSettings();

  const isPending = isProfilePending || isSettingsPending;

  const onChange = (newValue: boolean) => {
    // Handle toggle switch change
  };

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + height * 0.01,
          justifyContent: "flex-start",
        },
      ]}
    >
      <View
        style={[
          Styles.flexRow,
          {
            width: width * SCREEN_WIDTH_RATIO,
            justifyContent: "space-between",
            alignItems: "flex-start",
          },
        ]}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.xLarge,
          }}
        >
          Settings
        </Text>
        <TouchableOpacity style={{ marginTop: height * 0.01 }}>
          <NotificationIcon />
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: width * SCREEN_WIDTH_RATIO,
          marginTop: height * 0.035,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.medium,
            marginBottom: height * 0.01,
          }}
        >
          Profile
        </Text>
        {isPending ? (
          <SettingsSkeleton />
        ) : profileErrorMessage || !myProfile ? (
          <Text
            style={{
              color: colors.danger,
              fontWeight: FontWeights.medium,
              fontSize: FontSizes.small,
              textAlign: "left",
              marginTop: 5,
            }}
          >
            {profileErrorMessage ?? "Profile not found."}
          </Text>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/settings/profile/edit")}
            style={[
              Styles.flexRow,
              {
                justifyContent: "space-between",
                paddingTop: 5,
              },
            ]}
          >
            <View style={[Styles.flexRow, { gap: 15, alignItems: "center" }]}>
              <View
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 9999,
                  width: 64,
                  height: 64,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.surface,
                    fontWeight: FontWeights.medium,
                    fontSize: FontSizes.xLarge,
                  }}
                >
                  {myProfile?.first_name?.[0]?.toUpperCase()}
                  {myProfile?.last_name?.[0]?.toUpperCase()}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: FontWeights.semibold,
                    fontSize: FontSizes.medium,
                  }}
                >
                  {myProfile?.first_name} {myProfile?.last_name}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: FontWeights.semibold,
                    fontSize: FontSizes.small,
                  }}
                >
                  {myProfile?.email}
                </Text>
              </View>
            </View>
            <ChevronRightIcon
              width={20}
              height={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          width: width * SCREEN_WIDTH_RATIO,
          marginTop: height * 0.03,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.medium,
            marginBottom: height * 0.01,
          }}
        >
          Preferences
        </Text>
        <View style={{ gap: 10 }}>
          {isPending ? (
            <>
              <SettingsSkeleton />
              <SettingsSkeleton />
              <SettingsSkeleton />
            </>
          ) : settingsErrorMessage || !userSettings ? (
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.small,
              }}
            >
              {settingsErrorMessage || "Settings not found"}
            </Text>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => router.push("/settings/preferences/currency")}
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View
                  style={[
                    Styles.flexRow,
                    { width: "90%", justifyContent: "space-between" },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.bold,
                      fontSize: FontSizes.small,
                    }}
                  >
                    Currency
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.semibold,
                      fontSize: FontSizes.small,
                    }}
                  >
                    {userSettings?.currency.key} {"("}
                    {userSettings?.currency.name}
                    {")"}
                  </Text>
                </View>
                <ChevronRightIcon
                  width={20}
                  height={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/settings/preferences/timezone")}
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View
                  style={[
                    Styles.flexRow,
                    { width: "90%", justifyContent: "space-between" },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.bold,
                      fontSize: FontSizes.small,
                    }}
                  >
                    Timezone
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.semibold,
                      fontSize: FontSizes.small,
                    }}
                  >
                    {userSettings?.timezone.key.split("/")[0]}/
                    {userSettings?.timezone.name}
                  </Text>
                </View>
                <ChevronRightIcon
                  width={20}
                  height={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View
                  style={[
                    Styles.flexRow,
                    { width: "90%", justifyContent: "space-between" },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.bold,
                      fontSize: FontSizes.small,
                    }}
                  >
                    Theme
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.semibold,
                      fontSize: FontSizes.small,
                    }}
                  >
                    {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                  </Text>
                </View>
                <ChevronRightIcon
                  width={20}
                  height={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View
        style={{
          width: width * SCREEN_WIDTH_RATIO,
          marginTop: height * 0.03,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.medium,
            marginBottom: height * 0.01,
          }}
        >
          Notifications
        </Text>
        <View style={{ gap: 10 }}>
          {isPending ? (
            <>
              <SettingsSkeleton />
              <SettingsSkeleton />
            </>
          ) : settingsErrorMessage || !userSettings ? (
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.small,
              }}
            >
              {settingsErrorMessage || "Settings not found"}
            </Text>
          ) : (
            <>
              <View
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: FontWeights.bold,
                    fontSize: FontSizes.small,
                  }}
                >
                  Push Notifications
                </Text>
                <ToggleSwitch
                  value={userSettings?.push_notifications_enabled ?? false}
                  onValueChange={onChange}
                />
              </View>
              <View
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: FontWeights.bold,
                    fontSize: FontSizes.small,
                  }}
                >
                  Email Notifications
                </Text>
                <ToggleSwitch
                  value={userSettings?.email_notifications_enabled ?? false}
                  onValueChange={onChange}
                />
              </View>
            </>
          )}
        </View>
      </View>

      {/* <View
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
      </View> */}
    </View>
  );
}
