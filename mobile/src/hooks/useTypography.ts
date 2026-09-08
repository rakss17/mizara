import { useWindowDimensions } from "react-native";

import { FontSizes } from "@/styles/typography";

const BASE_WIDTH = 375;
const MIN_SCALE = 0.9;
const MAX_SCALE = 1.15;

export const useTypography = () => {
  const { width } = useWindowDimensions();

  const scaleFont = (size: number) => {
    const scale = width / BASE_WIDTH;

    return Math.min(Math.max(size * scale, size * MIN_SCALE), size * MAX_SCALE);
  };

  return {
    tiny: scaleFont(FontSizes.tiny),
    small: scaleFont(FontSizes.small),
    medium: scaleFont(FontSizes.medium),
    large: scaleFont(FontSizes.large),
    xLarge: scaleFont(FontSizes.xlarge),
    xxLarge: scaleFont(FontSizes.xxlarge),
    xxxLarge: scaleFont(FontSizes.xxxlarge),
  };
};
