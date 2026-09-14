import { ReactNode } from "react";
import { View, Text } from "react-native";
import { useWindowDimensions } from "react-native";

import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";

type AppFieldProps = {
  label: string;
  errorMessage?: string;
  children?: ReactNode;
};

export const AppField = ({ label, errorMessage, children }: AppFieldProps) => {
  const { height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();

  return (
    <View
      style={[
        Styles.flexColumn,
        {
          alignItems: "flex-start",
          gap: height * 0.01,
        },
      ]}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: FontSizes.medium,
          fontWeight: FontWeights.semibold,
        }}
      >
        {label}
      </Text>
      {children}
      {errorMessage && (
        <Text
          style={{
            color: colors.danger,
            fontSize: FontSizes.tiny,
            fontWeight: FontWeights.medium,
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};
