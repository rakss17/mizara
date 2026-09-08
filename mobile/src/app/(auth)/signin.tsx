import { useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import Logo from "@/assets/icons/logo.svg";
import GoogleLogo from "@/assets/icons/google-logo.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { Colors } from "@/styles/colors";
import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { useSignIn } from "@/services/auth/hooks";

export default function SignIn() {
  const FontSizes = useTypography();
  const { width, height } = useWindowDimensions();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { signIn, isPending, errorMessage } = useSignIn();

  const handleSignIn = () => {
    signIn({ email: data.email, password: data.password });
  };

  return (
    // <KeyboardAwareScrollView
    //   contentContainerStyle={[
    //     Styles.container,
    //     { backgroundColor: Colors.background },
    //   ]}
    // >
    <View style={[Styles.container, { backgroundColor: Colors.background }]}>
      <View style={Styles.flexColumn}>
        <Logo width={60} height={60} />
        <Text
          style={{
            fontSize: FontSizes.xxxLarge,
            fontWeight: FontWeights.bold,
            color: Colors.primary,
          }}
        >
          Mizara
        </Text>
        <Text
          style={{
            fontSize: FontSizes.medium,
            fontWeight: FontWeights.medium,
            color: Colors.textSecondary,
            width: width * 0.4,
            textAlign: "center",
          }}
        >
          Balance your recurring payments.
        </Text>
      </View>
      <View
        style={[
          Styles.flexColumn,
          { marginTop: height * 0.05, gap: height * 0.02 },
        ]}
      >
        <AppField label="Email">
          <AppInput
            placeholder="Enter your email address"
            value={data.email}
            onChangeText={(text) => setData({ ...data, email: text })}
            autoComplete="email"
          />
        </AppField>
        <AppField label="Password">
          <AppInput
            placeholder="Enter your password"
            value={data.password}
            onChangeText={(text) => setData({ ...data, password: text })}
            autoComplete="password"
            secureTextEntry
          />
          <TouchableOpacity style={{ alignSelf: "flex-end" }}>
            <Text
              style={{
                fontSize: FontSizes.tiny,
                fontWeight: FontWeights.bold,
                color: Colors.primary,
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </AppField>
      </View>
      <View
        style={[
          Styles.flexColumn,
          { marginTop: height * 0.035, gap: height * 0.02 },
        ]}
      >
        {errorMessage && (
          <Text
            style={{
              color: Colors.error,
              fontSize: FontSizes.small,
              textAlign: "center",
              width: width * 0.85,
            }}
          >
            {errorMessage}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={isPending}
          style={{
            width: width * 0.85,
            paddingVertical: 15,
            backgroundColor: Colors.primary,
            borderRadius: 6,
            alignItems: "center",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
              Sign in
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: width * 0.85,
            gap: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: Colors.border,
            }}
          />

          <Text
            style={{
              color: Colors.textMuted,
              fontSize: FontSizes.small,
            }}
          >
            or
          </Text>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: Colors.border,
            }}
          />
        </View>
        <TouchableOpacity
          style={[
            Styles.flexRow,
            {
              width: width * 0.85,
              paddingVertical: 10,
              backgroundColor: "transparent",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: Colors.border,
              gap: 8,
            },
          ]}
        >
          <GoogleLogo />
          <Text
            style={{ color: Colors.textPrimary, fontWeight: FontWeights.bold }}
          >
            Sign in with Google
          </Text>
        </TouchableOpacity>

        <View style={[Styles.flexRow, { gap: 5, marginTop: height * 0.03 }]}>
          <Text
            style={{
              color: Colors.textSecondary,
              fontSize: FontSizes.small,
              fontWeight: FontWeights.semibold,
            }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                color: Colors.primary,
                fontSize: FontSizes.small,
                fontWeight: FontWeights.bold,
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // </KeyboardAwareScrollView>
  );
}
