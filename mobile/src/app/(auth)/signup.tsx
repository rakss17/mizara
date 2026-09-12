import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { Colors } from "@/styles/colors";
import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { signUpSchema, type SignUpFormData } from "@/schemas/signup";
import { useSignUp } from "@/services/auth/hooks";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import { SignUpPayload } from "@/services/auth/types";

export default function SignUp() {
  const router = useRouter();
  const FontSizes = useTypography();
  const { width, height } = useWindowDimensions();
  const { signUp, isPending, errorMessage } = useSignUp();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgreed: false,
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    const payload: SignUpPayload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    };

    signUp(payload);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        Styles.container,
        {
          backgroundColor: Colors.background,
          justifyContent: "flex-start",
          paddingTop: height * 0.015,
        },
      ]}
    >
      <View style={{ width: width * SCREEN_WIDTH_RATIO, gap: height * 0.005 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: FontSizes.xxLarge,
            fontWeight: FontWeights.bold,
            color: Colors.textPrimary,
            marginTop: height * 0.01,
          }}
        >
          Create your account
        </Text>
        <Text
          style={{
            fontSize: FontSizes.medium,
            fontWeight: FontWeights.medium,
            color: Colors.textSecondary,
          }}
        >
          Let's get you started
        </Text>
      </View>
      <View
        style={[
          Styles.flexColumn,
          {
            marginTop: height * 0.025,
            gap: height * 0.015,
            width: width * SCREEN_WIDTH_RATIO,
          },
        ]}
      >
        <View
          style={[
            Styles.flexRow,
            {
              gap: width * 0.02,
              alignItems: "flex-start",
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
                  widthRatio={0.44}
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
                  widthRatio={0.44}
                  error={!!errors.lastName}
                  autoCapitalize="words"
                />
              </AppField>
            )}
          />
        </View>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <AppField label="Email" errorMessage={errors.email?.message}>
              <AppInput
                placeholder="Enter your email address"
                value={value}
                onChangeText={onChange}
                autoComplete="email"
                error={!!errors.email}
              />
            </AppField>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <AppField label="Password" errorMessage={errors.password?.message}>
              <AppInput
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                autoComplete="password"
                secureTextEntry
                error={!!errors.password}
              />
            </AppField>
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <AppField
              label="Confirm password"
              errorMessage={errors.confirmPassword?.message}
            >
              <AppInput
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                autoComplete="password"
                secureTextEntry
                error={!!errors.confirmPassword}
              />
            </AppField>
          )}
        />
        <Controller
          control={control}
          name="isAgreed"
          render={({ field: { value, onChange } }) => (
            <View style={[Styles.flexColumn, { alignItems: "flex-start" }]}>
              <View
                style={[
                  Styles.flexRow,
                  {
                    marginTop: height * 0.005,
                    gap: 10,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <Checkbox
                  style={{
                    width: 20,
                    height: 20,
                    borderColor: !!errors.isAgreed
                      ? Colors.danger
                      : Colors.border,
                    borderWidth: 1,
                  }}
                  value={value}
                  onValueChange={onChange}
                  color={value ? Colors.primary : undefined}
                />
                <Text
                  style={{
                    flex: 1,
                    flexShrink: 1,
                    fontSize: FontSizes.small,
                    fontWeight: FontWeights.medium,
                    lineHeight: 20,
                  }}
                >
                  I agree to the{" "}
                  <Text style={Styles.link}>Terms of Service</Text> and{" "}
                  <Text style={Styles.link}>Privacy Policy</Text>.
                </Text>
              </View>
              {!!errors.isAgreed && (
                <Text
                  style={{
                    color: Colors.danger,
                    fontSize: FontSizes.tiny,
                    fontWeight: FontWeights.medium,
                    textAlign: "left",
                  }}
                >
                  {errors.isAgreed?.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>
      {errorMessage && (
        <Text
          style={{
            color: Colors.danger,
            fontSize: FontSizes.small,
            textAlign: "center",
            width: width * SCREEN_WIDTH_RATIO,
          }}
        >
          {errorMessage}
        </Text>
      )}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        style={{
          marginTop: height * 0.04,
          width: width * SCREEN_WIDTH_RATIO,
          paddingVertical: 15,
          backgroundColor: Colors.primary,
          borderRadius: 6,
          alignItems: "center",
        }}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
            Sign up
          </Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
