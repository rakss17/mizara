import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Checkbox from "expo-checkbox";

import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";

export type RecurringPaymentType = "Subscription" | "Bills";

export type RecurringPaymentFilters = {
  type?: RecurringPaymentType;
  is_archived?: boolean;
  is_auto_renew?: boolean;
  is_free_trial?: boolean;
  category_id?: string;
};

export type FilterCategory = {
  id: string;
  name: string;
};

type RecurringPaymentsFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  filters: RecurringPaymentFilters;
  onApply: (filters: RecurringPaymentFilters) => void;
  categories?: FilterCategory[];
};

const TYPE_OPTIONS: RecurringPaymentType[] = ["Subscription", "Bills"];

const EMPTY_FILTERS: RecurringPaymentFilters = {};

export const RecurringPaymentsFilterModal = ({
  visible,
  onClose,
  filters,
  onApply,
  categories = [],
}: RecurringPaymentsFilterModalProps) => {
  const { height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();

  const [draft, setDraft] = useState<RecurringPaymentFilters>(filters);
  const [wasVisible, setWasVisible] = useState(visible);

  // Reset the draft to the applied filters each time the sheet opens, using
  // the render-time "adjusting state" pattern instead of an effect so the
  // reset lands before the first paint (no flash of stale filters).
  if (visible !== wasVisible) {
    setWasVisible(visible);

    if (visible) {
      setDraft(filters);
    }
  }

  const toggleType = (type: RecurringPaymentType) => {
    setDraft((prev) => ({
      ...prev,
      type: prev.type === type ? undefined : type,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setDraft((prev) => ({
      ...prev,
      category_id: prev.category_id === categoryId ? undefined : categoryId,
    }));
  };

  const toggleBoolean = (key: keyof RecurringPaymentFilters) => {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key] ? undefined : true,
    }));
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
  };

  const handleApply = () => {
    onApply(draft);
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
            maxHeight: height * 0.85,
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
              Filters
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

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <FilterSection title="Type">
              <View style={[Styles.flexRow, { gap: 10, flexWrap: "wrap" }]}>
                {TYPE_OPTIONS.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    selected={draft.type === type}
                    onPress={() => toggleType(type)}
                  />
                ))}
              </View>
            </FilterSection>

            {categories.length > 0 && (
              <FilterSection title="Category">
                <View style={[Styles.flexRow, { gap: 10, flexWrap: "wrap" }]}>
                  {categories.map((category) => (
                    <FilterChip
                      key={category.id}
                      label={category.name}
                      selected={draft.category_id === category.id}
                      onPress={() => toggleCategory(category.id)}
                    />
                  ))}
                </View>
              </FilterSection>
            )}

            <FilterSection title="Status">
              <FilterCheckboxRow
                label="Only auto-renew"
                checked={!!draft.is_auto_renew}
                onToggle={() => toggleBoolean("is_auto_renew")}
              />
              <FilterCheckboxRow
                label="Only free trial"
                checked={!!draft.is_free_trial}
                onToggle={() => toggleBoolean("is_free_trial")}
              />
              <FilterCheckboxRow
                label="Only archived"
                checked={!!draft.is_archived}
                onToggle={() => toggleBoolean("is_archived")}
              />
            </FilterSection>
          </ScrollView>

          <View
            style={[
              Styles.flexRow,
              { gap: 10, paddingHorizontal: 20, paddingTop: 16 },
            ]}
          >
            <TouchableOpacity
              onPress={handleReset}
              style={{
                flex: 1,
                paddingVertical: 13,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: FontWeights.semibold,
                  fontSize: FontSizes.medium,
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={{
                flex: 1,
                paddingVertical: 13,
                borderRadius: 8,
                backgroundColor: colors.primary,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.surface,
                  fontWeight: FontWeights.semibold,
                  fontSize: FontSizes.medium,
                }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const FontSizes = useTypography();

  return (
    <View style={{ marginBottom: 22 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontWeight: FontWeights.semibold,
          fontSize: FontSizes.small,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

const FilterChip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const FontSizes = useTypography();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.overviewBgBlue : colors.surface,
      }}
    >
      <Text
        style={{
          color: selected ? colors.primary : colors.textPrimary,
          fontWeight: FontWeights.medium,
          fontSize: FontSizes.small,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const FilterCheckboxRow = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => {
  const { colors } = useTheme();
  const FontSizes = useTypography();

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        Styles.flexRow,
        { justifyContent: "flex-start", gap: 10, paddingVertical: 8 },
      ]}
    >
      <Checkbox
        value={checked}
        onValueChange={onToggle}
        color={checked ? colors.primary : undefined}
        style={{
          width: 20,
          height: 20,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      />
      <Text
        style={{
          color: colors.textPrimary,
          fontWeight: FontWeights.medium,
          fontSize: FontSizes.small,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
