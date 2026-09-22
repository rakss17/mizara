import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import CloseIcon from "@/assets/icons/x.svg";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";

export type SelectModalOption = {
  label: string;
  value: string;
};

type SelectModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SelectModalOption[];
  value?: string;
  onSelect: (value: string) => void;
};

export const SelectModal = ({
  visible,
  onClose,
  title,
  options,
  value,
  onSelect,
}: SelectModalProps) => {
  const FontSizes = useTypography();
  const { colors } = useTheme();

  const handleSelect = (option: SelectModalOption) => {
    onSelect(option.value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onPress={onClose}
      >
        <Pressable
          style={{
            marginTop: "auto",
            backgroundColor: colors.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingBottom: 20,
          }}
        >
          <View
            style={[
              Styles.flexRow,
              {
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 18,
                paddingBottom: 10,
              },
            ]}
          >
            <TouchableOpacity style={{ width: 22 }} onPress={onClose}>
              <CloseIcon width={20} height={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: FontWeights.bold,
                fontSize: FontSizes.medium,
              }}
            >
              {title}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {options.map((option) => {
              const selected = value === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option)}
                  style={[
                    Styles.flexRow,
                    {
                      justifyContent: "space-between",
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? colors.primary : colors.textPrimary,
                      fontWeight: selected
                        ? FontWeights.semibold
                        : FontWeights.medium,
                      fontSize: FontSizes.small,
                    }}
                  >
                    {option.label}
                  </Text>
                  {selected && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.primary,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
