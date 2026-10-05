import { useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { RecurringPaymentFormSkeleton } from "@/components/Skeleton";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/schemas/profile";
import { useMyProfile, useUpdateMyProfile } from "@/services/user/hooks";
import type { UpdateMyProfilePayload } from "@/services/user/types";

export default function EditProfile() {
  const router = useRouter();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { width, height } = useWindowDimensions();
  const {
    myProfile,
    isPending: isProfileLoading,
    errorMessage: loadErrorMessage,
  } = useMyProfile();
  const { updateMyProfile, isPending, errorMessage } = useUpdateMyProfile();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (myProfile) {
      reset({
        firstName: myProfile.first_name,
        lastName: myProfile.last_name,
      });
    }
  }, [myProfile, reset]);

  const onSubmit = (data: UpdateProfileFormData) => {
    const payload: UpdateMyProfilePayload = {
      first_name: data.firstName,
      last_name: data.lastName,
    };

    updateMyProfile(payload, {
      onSuccess: () => {
        showToast("Profile updated.");
        router.back();
      },
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        Styles.container,
        {
          backgroundColor: colors.background,
          justifyContent: "flex-start",
          paddingTop: height * 0.02,
          paddingBottom: height * 0.01,
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
          Edit Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {isProfileLoading ? (
        <View style={{ width: width * SCREEN_WIDTH_RATIO }}>
          <RecurringPaymentFormSkeleton fields={3} />
        </View>
      ) : loadErrorMessage || !myProfile ? (
        <Text
          style={{
            color: colors.danger,
            fontWeight: FontWeights.medium,
            fontSize: FontSizes.small,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {loadErrorMessage ?? "Profile not found."}
        </Text>
      ) : (
        <>
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 9999,
              width: 88,
              height: 88,
              alignItems: "center",
              justifyContent: "center",
              marginTop: height * 0.01,
            }}
          >
            <Text
              style={{
                color: colors.surface,
                fontWeight: FontWeights.medium,
                fontSize: FontSizes.xxLarge,
              }}
            >
              {myProfile.first_name?.[0]?.toUpperCase()}
              {myProfile.last_name?.[0]?.toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              Styles.flexColumn,
              {
                marginTop: height * 0.03,
                gap: height * 0.015,
                width: width * SCREEN_WIDTH_RATIO,
              },
            ]}
          >
            <Controller
              control={control}
              name="firstName"
              render={({ field: { value, onChange } }) => (
                <AppField
                  label="First name"
                  errorMessage={errors.firstName?.message}
                >
                  <AppInput
                    placeholder="Enter your first name"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.firstName}
                    autoCapitalize="words"
                  />
                </AppField>
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange } }) => (
                <AppField
                  label="Last name"
                  errorMessage={errors.lastName?.message}
                >
                  <AppInput
                    placeholder="Enter your last name"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.lastName}
                    autoCapitalize="words"
                  />
                </AppField>
              )}
            />
            <AppField label="Email">
              <AppInput
                placeholder="Email"
                value={myProfile.email}
                onChangeText={() => {}}
                editable={false}
              />
            </AppField>
          </View>

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
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || !isDirty}
            style={{
              marginTop: height * 0.04,
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
    </KeyboardAwareScrollView>
  );
}
