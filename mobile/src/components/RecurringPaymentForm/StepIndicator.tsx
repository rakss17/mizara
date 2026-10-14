import { Fragment } from "react";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import CheckIcon from "@/assets/icons/check.svg";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";

type StepIndicatorProps = {
  currentStep: number;
  stepCount: number;
  onStepPress: (index: number) => void;
};

export function StepIndicator({
  currentStep,
  stepCount,
  onStepPress,
}: StepIndicatorProps) {
  const { colors } = useTheme();
  const FontSizes = useTypography();
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        Styles.flexRow,
        { width: width * SCREEN_WIDTH_RATIO, paddingVertical: 4 },
      ]}
    >
      {Array.from({ length: stepCount }, (_, index) => {
        const isCompleted = index < currentStep;
        const isActive = index <= currentStep;

        return (
          <Fragment key={index}>
            {index > 0 && (
              <View
                style={{
                  flex: 1,
                  height: 2,
                  marginHorizontal: 6,
                  backgroundColor: isActive ? colors.primary : colors.border,
                }}
              />
            )}
            {/* Only completed steps are tappable, so users can't skip validation. */}
            <TouchableOpacity
              onPress={() => onStepPress(index)}
              disabled={!isCompleted}
              hitSlop={8}
              style={{
                width: 38,
                height: 38,
                borderRadius: 99,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isActive
                  ? colors.primary
                  : colors.backgroundMuted,
              }}
            >
              {isCompleted ? (
                <CheckIcon color="white" width={18} height={18} />
              ) : (
                <Text
                  style={{
                    color: isActive ? "white" : colors.textSecondary,
                    fontSize: FontSizes.small,
                    fontWeight: FontWeights.bold,
                  }}
                >
                  {index + 1}
                </Text>
              )}
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </View>
  );
}
