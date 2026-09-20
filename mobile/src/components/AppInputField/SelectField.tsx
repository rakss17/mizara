import { TouchableOpacity, Text, useWindowDimensions } from "react-native";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { Styles } from "@/styles/stylesheets";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";

type SelectFieldProps = {
  value?: string;
  placeholder?: string;
  onPress: () => void;
  error?: boolean;
  widthRatio?: number;
};

export const SelectField = ({
  value,
  placeholder = "Select",
  onPress,
  error,
  widthRatio = SCREEN_WIDTH_RATIO,
}: SelectFieldProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const FontSizes = useTypography();

  const width = windowWidth * widthRatio;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        Styles.flexRow,
        {
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 6,
          paddingVertical: 12,
          paddingHorizontal: 14,
          width: width,
        },
      ]}
    >
      <Text
        style={{
          color: value ? colors.textPrimary : colors.textMuted,
          fontSize: FontSizes.small,
        }}
      >
        {value || placeholder}
      </Text>
      <ChevronDownIcon color={colors.textMuted} width={18} height={18} />
    </TouchableOpacity>
  );
};
