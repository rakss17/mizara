import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";

export type RecurringPaymentSortBy = "due_date" | "amount" | "name";

export type SortOrder = "ASC" | "DESC";

export type RecurringPaymentSort = {
  sort_by?: RecurringPaymentSortBy;
  sort_order?: SortOrder;
};

type SortMenuOption = {
  label: string;
  sort_by?: RecurringPaymentSortBy;
  sort_order?: SortOrder;
};

const SORT_OPTIONS: SortMenuOption[] = [
  { label: "Default" },
  { label: "Due Date: Earliest first", sort_by: "due_date", sort_order: "ASC" },
  { label: "Due Date: Latest first", sort_by: "due_date", sort_order: "DESC" },
  { label: "Amount: Low to High", sort_by: "amount", sort_order: "ASC" },
  { label: "Amount: High to Low", sort_by: "amount", sort_order: "DESC" },
  { label: "Name: A to Z", sort_by: "name", sort_order: "ASC" },
  { label: "Name: Z to A", sort_by: "name", sort_order: "DESC" },
];

type RecurringPaymentsSortMenuProps = {
  visible: boolean;
  onClose: () => void;
  value: RecurringPaymentSort;
  onSelect: (sort: RecurringPaymentSort) => void;
};

export const hasActiveSort = (sort: RecurringPaymentSort) =>
  sort.sort_by !== undefined || sort.sort_order !== undefined;

export const RecurringPaymentsSortMenu = ({
  visible,
  onClose,
  value,
  onSelect,
}: RecurringPaymentsSortMenuProps) => {
  const FontSizes = useTypography();
  const { colors } = useTheme();

  const handleSelect = (option: SortMenuOption) => {
    onSelect({ sort_by: option.sort_by, sort_order: option.sort_order });
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
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: FontWeights.bold,
                fontSize: FontSizes.large,
              }}
            >
              Sort By
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontWeight: FontWeights.medium,
                  fontSize: FontSizes.medium,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {SORT_OPTIONS.map((option) => {
              const selected =
                value.sort_by === option.sort_by &&
                value.sort_order === option.sort_order;

              return (
                <TouchableOpacity
                  key={option.label}
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
