import { Text, View, useWindowDimensions } from "react-native";

import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";
import { Skeleton } from "@/components/Skeleton";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor: string;
  color: string;
  isLoading?: boolean;
}

export const OverviewCard = ({
  title,
  value,
  icon,
  backgroundColor,
  color,
  isLoading = false,
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
      <View
        style={[
          Styles.flexRow,
          {
            justifyContent: "space-between",
            width: width * 0.295,
          },
        ]}
      >
        <Text
          style={{
            color,
            fontSize: FontSizes.small,
            fontWeight: FontWeights.semibold,
          }}
        >
          {title}
        </Text>
        {icon}
      </View>

      {isLoading ? (
        <Skeleton width="50%" height={FontSizes.large} />
      ) : (
        <Text
          style={{
            color,
            fontSize: FontSizes.large,
            fontWeight: FontWeights.bold,
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
};
