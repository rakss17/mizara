import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { SettingsSkeleton } from "@/components/Skeleton";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import {
  useUpdateUserSettings,
  useUserSettings,
  useUserSettingsOptions,
} from "@/services/user/hooks";

export default function CurrencyPreference() {
  const router = useRouter();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { width, height } = useWindowDimensions();
  const {
    userSettings,
    isPending: isSettingsLoading,
    errorMessage: settingsErrorMessage,
  } = useUserSettings();
  const {
    userSettingsOptions,
    isPending: isOptionsLoading,
    errorMessage: optionsErrorMessage,
  } = useUserSettingsOptions();
  const { updateUserSettings, isPending, errorMessage } =
    useUpdateUserSettings();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  useEffect(() => {
    if (userSettings) {
      setSelectedCurrency(userSettings.currency.key);
    }
  }, [userSettings]);

  const isLoading = isSettingsLoading || isOptionsLoading;
  const loadErrorMessage = settingsErrorMessage || optionsErrorMessage;
  const isDirty =
    !!selectedCurrency && selectedCurrency !== userSettings?.currency.key;

  const onSubmit = () => {
    if (!selectedCurrency) return;

    updateUserSettings(
      { currency: selectedCurrency },
      {
        onSuccess: () => {
          showToast("Currency updated.");
          router.back();
        },
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
          Currency
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={{ width: width * SCREEN_WIDTH_RATIO, gap: 10 }}>
          <SettingsSkeleton />
          <SettingsSkeleton />
          <SettingsSkeleton />
          <SettingsSkeleton />
        </View>
      ) : loadErrorMessage || !userSettings || !userSettingsOptions ? (
        <Text
          style={{
            color: colors.danger,
            fontWeight: FontWeights.medium,
            fontSize: FontSizes.small,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {loadErrorMessage ?? "Currency options not found."}
        </Text>
      ) : (
        <>
          <ScrollView
            style={{ flex: 1, width: width * 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                overflow: "hidden",
              }}
            >
              {[...userSettingsOptions.currencies]
                .sort(
                  (a, b) =>
                    Number(b.key === userSettings.currency.key) -
                    Number(a.key === userSettings.currency.key),
                )
                .map((option) => {
                  const isSelected = selectedCurrency === option.key;

                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => setSelectedCurrency(option.key)}
                      disabled={isPending}
                      style={[
                        Styles.flexRow,
                        {
                          justifyContent: "space-between",
                          paddingVertical: 20,
                          paddingHorizontal: 30,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: isSelected
                            ? colors.primary
                            : colors.textSecondary,
                          fontWeight: FontWeights.semibold,
                          fontSize: FontSizes.medium,
                        }}
                      >
                        {option.key} ({option.name})
                      </Text>
                      {isSelected && (
                        <CheckIcon
                          width={24}
                          height={24}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ScrollView>

          {errorMessage && (
            <Text
              style={{
                color: colors.danger,
                fontSize: FontSizes.small,
                textAlign: "center",
                width: width * SCREEN_WIDTH_RATIO,
                marginTop: height * 0.02,
              }}
            >
              {errorMessage}
            </Text>
          )}

          <TouchableOpacity
            onPress={onSubmit}
            disabled={isPending || !isDirty}
            style={{
              marginTop: height * 0.02,
              width: width * SCREEN_WIDTH_RATIO,
              paddingVertical: 15,
              backgroundColor: colors.primary,
              borderRadius: 6,
              alignItems: "center",
              opacity: isDirty ? 1 : 0.5,
            }}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
                Save changes
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
