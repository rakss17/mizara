import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useWindowDimensions } from "react-native";

import EyeIcon from "@/assets/icons/eye.svg";
import EyeOffIcon from "@/assets/icons/eye-off.svg";
import { Colors } from "@/styles/colors";
import { useTypography } from "@/hooks/useTypography";

type AppInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  autoComplete?: "email" | "password" | "off";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
};

export const AppInput = ({
  placeholder,
  value,
  onChangeText,
  autoComplete = "off",
  autoCapitalize = "none",
  secureTextEntry = false,
}: AppInputProps) => {
  const { width } = useWindowDimensions();
  const FontSizes = useTypography();
  const [showPassword, setShowPassword] = useState(false);

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
        placeholderTextColor={Colors.textMuted}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        style={{
          borderColor: Colors.border,
          borderWidth: 1,
          width: width * 0.85,
          paddingLeft: 10,
          paddingVertical: 12,
          fontSize: FontSizes.small,
          borderRadius: 6,
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
