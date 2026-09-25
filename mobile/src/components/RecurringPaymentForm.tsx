import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { SelectField } from "@/components/AppInputField/SelectField";
import { SelectModal } from "@/components/SelectModal";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import {
  RECURRING_PAYMENT_BILLING_CYCLES,
  RECURRING_PAYMENT_TYPES,
  createRecurringPaymentSchema,
  type CreateRecurringPaymentFormData,
} from "@/schemas/recurring-payment";
import { useCategories } from "@/services/category/hooks";

type RecurringPaymentFormProps = {
  defaultValues: CreateRecurringPaymentFormData;
  onSubmit: (data: CreateRecurringPaymentFormData) => void;
  isPending: boolean;
  errorMessage?: string | null;
  resetLabel: string;
};

export function RecurringPaymentForm({
  defaultValues,
  onSubmit,
  isPending,
  errorMessage,
  resetLabel,
}: RecurringPaymentFormProps) {
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { categories } = useCategories();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showBillingCycleModal, setShowBillingCycleModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRecurringPaymentFormData>({
    resolver: zodResolver(createRecurringPaymentSchema),
    defaultValues,
  });

  return (
    <ScrollView contentContainerStyle={{ width: width * 1 }}>
      <View
        style={[
          Styles.flexColumn,
          {
            marginTop: height * 0.01,
            gap: height * 0.015,
          },
        ]}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <AppField label="Name" errorMessage={errors.name?.message}>
              <AppInput
                placeholder="e.g. Netflix"
                value={value}
                onChangeText={onChange}
                widthRatio={SCREEN_WIDTH_RATIO}
                error={!!errors.name}
              />
            </AppField>
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <AppField label="Type" errorMessage={errors.type?.message}>
              <SelectField
                value={value}
                placeholder="Select type"
                onPress={() => setShowTypeModal(true)}
                error={!!errors.type}
              />
              <SelectModal
                visible={showTypeModal}
                onClose={() => setShowTypeModal(false)}
                title="Select Type"
                value={value}
                options={RECURRING_PAYMENT_TYPES.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onSelect={(selected) =>
                  onChange(selected as (typeof RECURRING_PAYMENT_TYPES)[number])
                }
              />
            </AppField>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <AppField
              label="Description (optional)"
              errorMessage={errors.description?.message}
            >
              <AppInput
                placeholder="e.g. Family plan subscription"
                value={value ?? ""}
                onChangeText={onChange}
                widthRatio={SCREEN_WIDTH_RATIO}
                autoCapitalize="sentences"
              />
            </AppField>
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <AppField label="Amount" errorMessage={errors.amount?.message}>
              <AppInput
                placeholder="0.00"
                value={value}
                onChangeText={onChange}
                widthRatio={SCREEN_WIDTH_RATIO}
                error={!!errors.amount}
                keyboardType="numeric"
              />
            </AppField>
          )}
        />

        <Controller
          control={control}
          name="billing_cycle"
          render={({ field: { value, onChange } }) => (
            <AppField
              label="Billing cycle"
              errorMessage={errors.billing_cycle?.message}
            >
              <SelectField
                value={value}
                placeholder="Select billing cycle"
                onPress={() => setShowBillingCycleModal(true)}
                error={!!errors.billing_cycle}
              />
              <SelectModal
                visible={showBillingCycleModal}
                onClose={() => setShowBillingCycleModal(false)}
                title="Select Billing Cycle"
                value={value}
                options={RECURRING_PAYMENT_BILLING_CYCLES.map((cycle) => ({
                  label: cycle,
                  value: cycle,
                }))}
                onSelect={(selected) =>
                  onChange(
                    selected as (typeof RECURRING_PAYMENT_BILLING_CYCLES)[number],
                  )
                }
              />
            </AppField>
          )}
        />

        {categories.length > 0 && (
          <Controller
            control={control}
            name="category_id"
            render={({ field: { value, onChange } }) => (
              <AppField
                label="Category"
                errorMessage={errors.category_id?.message}
              >
                <SelectField
                  value={
                    categories.find((category) => category.id === value)?.name
                  }
                  placeholder="Select category"
                  onPress={() => setShowCategoryModal(true)}
                  error={!!errors.category_id}
                />
                <SelectModal
                  visible={showCategoryModal}
                  onClose={() => setShowCategoryModal(false)}
                  title="Select Category"
                  value={value}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  onSelect={(selected) => onChange(selected)}
                />
              </AppField>
            )}
          />
        )}

        <Controller
          control={control}
          name="due_date"
          render={({ field: { value, onChange } }) => (
            <AppField label="Due date" errorMessage={errors.due_date?.message}>
              <View
                style={[
                  Styles.flexRow,
                  {
                    gap: 5,
                    width: width * SCREEN_WIDTH_RATIO,
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <SelectField
                  value={value?.toLocaleDateString()}
                  placeholder="Select date"
                  onPress={() => setShowDatePicker(true)}
                  error={!!errors.due_date}
                  widthRatio={0.55}
                />
                <SelectField
                  value={value?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  placeholder="Select time"
                  onPress={() => setShowTimePicker(true)}
                  error={!!errors.due_date}
                  widthRatio={0.33}
                />
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="date"
                  display="default"
                  onValueChange={(_event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const next = new Date(value ?? selectedDate);
                      next.setFullYear(selectedDate.getFullYear());
                      next.setMonth(selectedDate.getMonth());
                      next.setDate(selectedDate.getDate());
                      onChange(next);
                    }
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="time"
                  display="default"
                  onValueChange={(_event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) {
                      const next = new Date(value ?? selectedDate);
                      next.setHours(selectedDate.getHours());
                      next.setMinutes(selectedDate.getMinutes());
                      onChange(next);
                    }
                  }}
                />
              )}
            </AppField>
          )}
        />
        <View
          style={[
            Styles.flexColumn,
            { width: width * SCREEN_WIDTH_RATIO, gap: "5" },
          ]}
        >
          <Controller
            control={control}
            name="is_auto_renew"
            render={({ field: { value, onChange } }) => (
              <View
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                    paddingVertical: 4,
                    width: width * SCREEN_WIDTH_RATIO,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: FontSizes.medium,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  Auto-renew
                </Text>
                <ToggleSwitch value={value} onValueChange={onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="is_free_trial"
            render={({ field: { value, onChange } }) => (
              <View
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                    paddingVertical: 4,
                    width: width * SCREEN_WIDTH_RATIO,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: FontSizes.medium,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  Free trial
                </Text>
                <ToggleSwitch value={value} onValueChange={onChange} />
              </View>
            )}
          />
        </View>

        {errorMessage && (
          <Text
            style={{
              color: colors.danger,
              fontSize: FontSizes.small,
              textAlign: "center",
              width: width * SCREEN_WIDTH_RATIO,
              marginTop: height * 0.015,
            }}
          >
            {errorMessage}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          style={{
            marginTop: height * 0.03,
            width: width * SCREEN_WIDTH_RATIO,
            paddingVertical: 15,
            backgroundColor: colors.primary,
            borderRadius: 6,
            alignItems: "center",
          }}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => reset()}
          disabled={isPending}
          style={[
            Styles.flexRow,
            {
              width: width * SCREEN_WIDTH_RATIO,
              paddingVertical: 10,
              backgroundColor: "transparent",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 8,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontWeight: FontWeights.semibold,
            }}
          >
            {resetLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
