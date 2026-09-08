import { useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Checkbox from "expo-checkbox";
import { Link } from "expo-router";

import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { Colors } from "@/styles/colors";
import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";

export default function SignUp() {
  const FontSizes = useTypography();
  const { width, height } = useWindowDimensions();
  const [isAgreed, setIsAgreed] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        Styles.container,
        { backgroundColor: Colors.background },
      ]}
    >
      <View style={{ width: width * SCREEN_WIDTH_RATIO, gap: height * 0.005 }}>
        <Text
          style={{
            fontSize: FontSizes.xxLarge,
            fontWeight: FontWeights.bold,
            color: Colors.textPrimary,
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
            marginTop: height * 0.04,
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
            },
          ]}
        >
          <AppField label="First name">
            <AppInput
              placeholder="Enter your first name"
              value={data.email}
              onChangeText={(text) => setData({ ...data, email: text })}
              autoComplete="email"
              widthRatio={0.415}
            />
          </AppField>
          <AppField label="Last name">
            <AppInput
              placeholder="Enter your last name"
              value={data.email}
              onChangeText={(text) => setData({ ...data, email: text })}
              autoComplete="email"
              widthRatio={0.415}
            />
          </AppField>
        </View>
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
        </AppField>
        <AppField label="Confirm password">
          <AppInput
            placeholder="Confirm your password"
            value={data.password}
            onChangeText={(text) => setData({ ...data, password: text })}
            autoComplete="password"
            secureTextEntry
          />
        </AppField>
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
              borderColor: Colors.border,
              borderWidth: 1,
            }}
            value={isAgreed}
            onValueChange={setIsAgreed}
            color={isAgreed ? Colors.primary : undefined}
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
            I agree to the <Text style={Styles.link}>Terms of Service</Text> and{" "}
            <Text style={Styles.link}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          marginTop: height * 0.04,
          width: width * SCREEN_WIDTH_RATIO,
          paddingVertical: 15,
          backgroundColor: Colors.primary,
          borderRadius: 6,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
          Sign up
        </Text>
      </TouchableOpacity>

      <View style={[Styles.flexRow, { gap: 5, marginTop: height * 0.04 }]}>
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: FontSizes.small,
            fontWeight: FontWeights.semibold,
          }}
        >
          Already have an account?
        </Text>
        <Link href="/signin" asChild>
          <TouchableOpacity>
            <Text
              style={{
                color: Colors.primary,
                fontSize: FontSizes.small,
                fontWeight: FontWeights.bold,
              }}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
