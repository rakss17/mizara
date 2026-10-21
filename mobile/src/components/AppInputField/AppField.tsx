import { ReactNode } from "react";
import { View, Text } from "react-native";
import { useWindowDimensions } from "react-native";

import InfoIcon from "@/assets/icons/info.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";

type AppFieldProps = {
  label: string;
  errorMessage?: string;
  hint?: string;
  required?: boolean;
  widthRatio?: number;
  children?: ReactNode;
};

export const AppField = ({
  label,
  errorMessage,
  hint,
  required,
  widthRatio = SCREEN_WIDTH_RATIO,
  children,
}: AppFieldProps) => {
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();

  return (
    <View
      style={[
        Styles.flexColumn,
        {
          alignItems: "flex-start",
          gap: height * 0.01,
          width: width * widthRatio,
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
      {errorMessage ? (
        <Text
          style={{
            color: colors.danger,
            fontSize: FontSizes.tiny,
            fontWeight: FontWeights.medium,
          }}
        >
          {errorMessage}
        </Text>
      ) : (
        hint && (
          <View
            style={[
              Styles.flexRow,
              {
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: 4,
              },
            ]}
          >
            <InfoIcon
              width={FontSizes.tiny + 2}
              height={FontSizes.tiny + 2}
              color={colors.textSecondary}
              style={{ marginTop: 2 }}
            />
            <Text
              style={{
                flexShrink: 1,
                color: colors.textSecondary,
                fontSize: FontSizes.tiny,
                fontWeight: FontWeights.medium,
              }}
            >
              {hint}
            </Text>
          </View>
        )
      )}
    </View>
  );
};
