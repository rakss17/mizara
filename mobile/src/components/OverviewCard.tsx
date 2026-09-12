import { Text, View, useWindowDimensions } from "react-native";

import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor: string;
  color: string;
}

export const OverviewCard = ({
  title,
  value,
  icon,
  backgroundColor,
  color,
}: OverviewCardProps) => {
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();
  return (
    <View
      style={[
        {
          width: width * 0.43,
          height: height * 0.18,
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 20,
          justifyContent: "space-between",
          backgroundColor,
        },
      ]}
    >
      <Text
        style={{
          color,
          fontSize: FontSizes.medium,
          fontWeight: FontWeights.semibold,
        }}
      >
        {title}
      </Text>

      <View style={[Styles.flexRow, { justifyContent: "space-between" }]}>
        <Text
          style={{
            color,
            fontSize: FontSizes.xLarge,
            fontWeight: FontWeights.bold,
          }}
        >
          {value}
        </Text>

        {icon}
      </View>
    </View>
  );
};
