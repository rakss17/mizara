import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useWindowDimensions } from "react-native";

import EyeIcon from "@/assets/icons/eye.svg";
import EyeOffIcon from "@/assets/icons/eye-off.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";

type AppInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  autoComplete?: "email" | "password" | "off";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  widthRatio?: number;
  error?: boolean;
};

export const AppInput = ({
  placeholder,
  value,
  onChangeText,
  autoComplete = "off",
  autoCapitalize = "none",
  secureTextEntry = false,
  widthRatio = SCREEN_WIDTH_RATIO,
  error,
}: AppInputProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const textInputWidth = windowWidth * widthRatio;

  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholderTextColor={colors.textMuted}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        style={{
          borderColor: error ? colors.danger : colors.border,
          borderWidth: 1,
          width: textInputWidth,
          paddingLeft: 10,
          paddingVertical: 12,
          fontSize: FontSizes.small,
          borderRadius: 6,
          color: colors.textPrimary,
        }}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 10,
            top: 12,
          }}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </TouchableOpacity>
      )}
    </View>
  );
};
