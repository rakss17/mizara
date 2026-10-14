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
  required?: boolean;
  children?: ReactNode;
};

export const AppField = ({
  label,
  errorMessage,
  required,
  children,
}: AppFieldProps) => {
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
          color: colors.textSecondary,
          fontSize: FontSizes.small,
          fontWeight: FontWeights.semibold,
        }}
      >
        {label}
        {required && <Text style={{ color: colors.danger }}> *</Text>}
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
