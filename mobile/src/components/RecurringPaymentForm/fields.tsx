import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  type KeyboardTypeOptions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { useController, type FieldPath } from "react-hook-form";

import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { SelectField } from "@/components/AppInputField/SelectField";
import { SelectModal, type SelectModalOption } from "@/components/SelectModal";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import type { CreateRecurringPaymentFormData } from "@/schemas/recurring-payment";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";

// Form fields that connect themselves to the surrounding <FormProvider>.
// Each one reads its own value and error, so callers only pass a `name`.

export type FieldName = FieldPath<CreateRecurringPaymentFormData>;

type FieldProps = {
  name: FieldName;
  label: string;
  required?: boolean;
};

const useField = (name: FieldName) =>
  useController<CreateRecurringPaymentFormData>({ name });

export function TextField({
  name,
  label,
  required,
  placeholder,
  keyboardType,
  autoCapitalize,
}: FieldProps & {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const { field, fieldState } = useField(name);

  return (
    <AppField
      label={label}
      required={required}
      errorMessage={fieldState.error?.message}
    >
      <AppInput
        placeholder={placeholder}
        value={(field.value as string | undefined) ?? ""}
        onChangeText={field.onChange}
        widthRatio={SCREEN_WIDTH_RATIO}
        error={!!fieldState.error}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </AppField>
  );
}

const toTitleCase = (text: string) =>
  text.replace(/\b\w/g, (letter) => letter.toUpperCase());

export const toOptions = <V extends string>(
  values: readonly V[],
  descriptions?: Record<V, string>,
): SelectModalOption[] =>
  values.map((value) => ({
    label: value,
    value,
    description: descriptions?.[value],
  }));

export function SelectInputField({
  name,
  label,
  required,
  placeholder,
  options,
  hint,
}: FieldProps & {
  placeholder: string;
  options: SelectModalOption[];
  hint?: string;
}) {
  const { field, fieldState } = useField(name);
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((option) => option.value === field.value);

  return (
    <AppField
      label={label}
      required={required}
      errorMessage={fieldState.error?.message}
      hint={selected?.description ?? hint}
    >
      <SelectField
        value={selected?.label}
        placeholder={placeholder}
        onPress={() => setIsOpen(true)}
        error={!!fieldState.error}
      />
      <SelectModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Select ${toTitleCase(label)}`}
        value={field.value as string | undefined}
        options={options}
        onSelect={field.onChange}
      />
    </AppField>
  );
}

export function DateField({
  name,
  label,
  required,
  placeholder,
  withTime = false,
}: FieldProps & { placeholder: string; withTime?: boolean }) {
  const { width } = useWindowDimensions();
  const { field, fieldState } = useField(name);
  const [openPicker, setOpenPicker] = useState<"date" | "time" | null>(null);

  const value = field.value as Date | undefined;

  // Apply only the picked part (date or time), keeping the rest of the value.
  const onPick = (picked: Date) => {
    const next = new Date(value ?? picked);
    if (openPicker === "date") {
      next.setFullYear(
        picked.getFullYear(),
        picked.getMonth(),
        picked.getDate(),
      );
    } else {
      next.setHours(picked.getHours(), picked.getMinutes());
    }
    field.onChange(next);
  };

  return (
    <AppField
      label={label}
      required={required}
      errorMessage={fieldState.error?.message}
    >
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
          placeholder={placeholder}
          onPress={() => setOpenPicker("date")}
          error={!!fieldState.error}
          widthRatio={withTime ? 0.55 : SCREEN_WIDTH_RATIO}
        />
        {withTime && (
          <SelectField
            value={value?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            placeholder="Select time"
            onPress={() => setOpenPicker("time")}
            error={!!fieldState.error}
            widthRatio={0.33}
          />
        )}
      </View>

      {openPicker && (
        <DateTimePicker
          value={value ?? new Date()}
          mode={openPicker}
          display="default"
          onValueChange={(_event, picked) => {
            setOpenPicker(null);
            if (picked) onPick(picked);
          }}
        />
      )}
    </AppField>
  );
}

export function ToggleField({ name, label }: Omit<FieldProps, "required">) {
  const { colors } = useTheme();
  const FontSizes = useTypography();
  const { width } = useWindowDimensions();
  const { field } = useField(name);

  return (
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
          fontSize: FontSizes.small,
          fontWeight: FontWeights.semibold,
        }}
      >
        {label}
      </Text>
      <ToggleSwitch
        value={field.value as boolean}
        onValueChange={field.onChange}
      />
    </View>
  );
}

/** A list of checkboxes bound to an array field. */
export function CheckboxGroupField<V extends string | number>({
  name,
  label,
  options,
  labels,
}: Omit<FieldProps, "required"> & {
  options: readonly V[];
  labels: Record<V, string>;
}) {
  const { colors } = useTheme();
  const FontSizes = useTypography();
  const { field, fieldState } = useField(name);

  const selected = field.value as V[];

  const toggle = (option: V) =>
    field.onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    );

  return (
    <View style={{ gap: 4 }}>
      <Text
        style={{
          color: colors.textPrimary,
          fontWeight: FontWeights.semibold,
          fontSize: FontSizes.small,
        }}
      >
        {label}
      </Text>

      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            onPress={() => toggle(option)}
            style={[
              Styles.flexRow,
              { justifyContent: "flex-start", gap: 10, paddingVertical: 8 },
            ]}
          >
            <Checkbox
              value={checked}
              onValueChange={() => toggle(option)}
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
                color: colors.textSecondary,
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.small,
              }}
            >
              {labels[option]}
            </Text>
          </TouchableOpacity>
        );
      })}

      {fieldState.error && (
        <Text
          style={{
            color: colors.danger,
            fontSize: FontSizes.tiny,
            fontWeight: FontWeights.medium,
          }}
        >
          {fieldState.error.message}
        </Text>
      )}
    </View>
  );
}
