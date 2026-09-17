import { TextInput, View, useWindowDimensions, type ViewStyle } from "react-native";

import SearchIcon from "@/assets/icons/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  widthRatio?: number;
  style?: ViewStyle;
};

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search",
  widthRatio = SCREEN_WIDTH_RATIO,
  style,
}: SearchBarProps) => {
  const { width } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          width: width * widthRatio,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 6,
          paddingHorizontal: 10,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      <SearchIcon color={colors.textMuted} width={18} height={18} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        style={{
          flex: 1,
          paddingLeft: 8,
          paddingVertical: 12,
          fontSize: FontSizes.small,
          color: colors.textPrimary,
        }}
      />
    </View>
  );
};
