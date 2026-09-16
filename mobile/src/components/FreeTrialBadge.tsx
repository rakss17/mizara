import { View, Text } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";

export const FreeTrialBadge = () => {
  const FontSizes = useTypography();
  const { colors } = useTheme();

  return (
    <View
      style={{
        padding: 3.5,
        borderColor: colors.overviewFontYellow,
        borderWidth: 1,
        backgroundColor: colors.overviewBgYellow,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: FontSizes.tiny,
          fontWeight: FontWeights.semibold,
        }}
      >
        Free Trial
      </Text>
    </View>
  );
};
