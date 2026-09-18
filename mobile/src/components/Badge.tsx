import { View, Text } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";

export enum Variant {
  FreeTrial = "Free Trial",
  Archived = "Archived",
}

type BadgeProps = {
  variant: Variant;
};

export const Badge = ({ variant }: BadgeProps) => {
  const FontSizes = useTypography();
  const { colors } = useTheme();

  return (
    <View
      style={{
        padding: 3.5,
        borderColor:
          variant === Variant.FreeTrial
            ? colors.overviewFontYellow
            : colors.textSecondary,
        borderWidth: 1,
        backgroundColor:
          variant === Variant.FreeTrial
            ? colors.overviewBgYellow
            : colors.backgroundMuted,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: FontSizes.tiny,
          fontWeight: FontWeights.semibold,
          color:
            variant === Variant.FreeTrial
              ? colors.overviewFontYellow
              : colors.textSecondary,
        }}
      >
        {variant}
      </Text>
    </View>
  );
};
