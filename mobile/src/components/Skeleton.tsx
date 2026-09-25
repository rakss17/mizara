import { useEffect, useState } from "react";
import { Animated, Easing, type DimensionValue, type ViewStyle } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { Styles } from "@/styles/stylesheets";

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
};

export const Skeleton = ({
  width = "100%",
  height = 16,
  borderRadius = 6,
  style,
}: SkeletonProps) => {
  const { colors } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.backgroundMuted,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const RecurringPaymentRowSkeleton = () => {
  const { colors } = useTheme();

  return (
    <Animated.View
      style={[
        Styles.flexRow,
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          gap: 10,
          padding: 10,
        },
      ]}
    >
      <Skeleton width={24} height={24} borderRadius={6} />
      <Animated.View
        style={[Styles.flexRow, { justifyContent: "space-between", flex: 1 }]}
      >
        <Animated.View style={{ gap: 6 }}>
          <Skeleton width={120} height={14} />
          <Skeleton width={70} height={10} />
          <Skeleton width={90} height={10} />
        </Animated.View>
        <Animated.View style={{ gap: 6, alignItems: "flex-end" }}>
          <Skeleton width={60} height={14} />
          <Skeleton width={70} height={10} />
          <Skeleton width={50} height={10} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export const RecurringPaymentListSkeleton = ({
  count = 6,
}: {
  count?: number;
}) => (
  <Animated.View style={{ gap: 10 }}>
    {Array.from({ length: count }).map((_, index) => (
      <RecurringPaymentRowSkeleton key={index} />
    ))}
  </Animated.View>
);

export const RecurringPaymentDetailSkeleton = () => {
  const { colors } = useTheme();

  return (
    <Animated.View style={{ gap: 16, width: "100%" }}>
      <Animated.View
        style={{
          width: "100%",
          gap: 10,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          backgroundColor: colors.surface,
        }}
      >
        <Skeleton width={36} height={36} borderRadius={8} />
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={24} />
        <Skeleton width="30%" height={12} />
      </Animated.View>

      <Animated.View
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          backgroundColor: colors.surface,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              Styles.flexRow,
              {
                justifyContent: "space-between",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.border,
              },
            ]}
          >
            <Skeleton width={90} height={12} />
            <Skeleton width={110} height={12} />
          </Animated.View>
        ))}
      </Animated.View>
    </Animated.View>
  );
};

export const RecurringPaymentFormSkeleton = ({
  fields = 7,
}: {
  fields?: number;
}) => (
  <Animated.View style={{ gap: 18, width: "100%", marginTop: 10 }}>
    {Array.from({ length: fields }).map((_, index) => (
      <Animated.View key={index} style={{ gap: 8 }}>
        <Skeleton width={80} height={12} />
        <Skeleton width="100%" height={44} borderRadius={6} />
      </Animated.View>
    ))}
  </Animated.View>
);
