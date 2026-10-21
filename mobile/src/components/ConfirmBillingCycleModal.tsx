import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CloseIcon from "@/assets/icons/x.svg";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { useTypography } from "@/hooks/useTypography";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { AppField } from "@/components/AppInputField/AppField";
import { AppInput } from "@/components/AppInputField/AppInput";
import { SelectField } from "@/components/AppInputField/SelectField";
import { useConfirmBillingCycle } from "@/services/recurring-payment/hooks";
import type {
  ConfirmBillingCyclePayload,
  RecurringPayment,
} from "@/services/recurring-payment/types";
import { formatDueDate } from "@/utils/recurring-payment";

// Mount only while open so the fields start from the rolled-over values.
type ConfirmBillingCycleModalProps = {
  onClose: () => void;
  recurringPayment: RecurringPayment;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const ConfirmBillingCycleModal = ({
  onClose,
  recurringPayment,
}: ConfirmBillingCycleModalProps) => {
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { width, height } = useWindowDimensions();
  const { confirmBillingCycle, isPending, errorMessage } =
    useConfirmBillingCycle();

  const isBillingDateVariable =
    recurringPayment.billing_date_type === "Variable" &&
    !!recurringPayment.billing_date;
  const isDueDateVariable = recurringPayment.due_date_type === "Variable";
  const isAmountVariable = recurringPayment.pricing_type === "Variable";

  const [billingDate, setBillingDate] = useState(() =>
    recurringPayment.billing_date
      ? new Date(recurringPayment.billing_date)
      : null,
  );
  const [dueDate, setDueDate] = useState(
    () => new Date(recurringPayment.due_date),
  );
  const [amount, setAmount] = useState(() =>
    String(Number(recurringPayment.amount)),
  );
  const [amountError, setAmountError] = useState<string | null>(null);
  const [showBillingDatePicker, setShowBillingDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const onConfirm = () => {
    const payload: ConfirmBillingCyclePayload = {};

    if (
      isBillingDateVariable &&
      billingDate &&
      recurringPayment.billing_date &&
      !isSameDay(billingDate, new Date(recurringPayment.billing_date))
    ) {
      payload.billing_date = billingDate.toISOString();
    }

    if (
      isDueDateVariable &&
      !isSameDay(dueDate, new Date(recurringPayment.due_date))
    ) {
      payload.due_date = dueDate.toISOString();
    }

    if (isAmountVariable) {
      const parsedAmount = Number(amount);
      if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setAmountError("Please enter a valid amount.");
        return;
      }
      if (parsedAmount !== Number(recurringPayment.amount)) {
        payload.amount = parsedAmount;
      }
    }

    confirmBillingCycle(
      { id: recurringPayment.id, payload },
      {
        onSuccess: () => {
          showToast("Billing cycle confirmed.");
          onClose();
        },
      },
    );
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
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
            paddingBottom: insets.bottom + 30,
            alignItems: "center",
          }}
        >
          <View
            style={[
              Styles.flexRow,
              {
                width: "100%",
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
              Confirm This Cycle
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View
            style={[
              Styles.flexColumn,
              { width: width * SCREEN_WIDTH_RATIO, gap: height * 0.015 },
            ]}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: FontWeights.medium,
                fontSize: FontSizes.small,
                width: "100%",
              }}
            >
              Your new bill for {recurringPayment.name} is in. Are these details
              correct? Update anything that changed this time.
            </Text>

            {isBillingDateVariable && billingDate && (
              <AppField label="Billing date">
                <SelectField
                  value={formatDueDate(billingDate.toISOString())}
                  placeholder="Select billing date"
                  onPress={() => setShowBillingDatePicker(true)}
                />
                {showBillingDatePicker && (
                  <DateTimePicker
                    value={billingDate}
                    mode="date"
                    display="default"
                    onValueChange={(_event, selectedDate) => {
                      setShowBillingDatePicker(false);
                      if (selectedDate) {
                        setBillingDate(selectedDate);
                      }
                    }}
                  />
                )}
              </AppField>
            )}

            {isDueDateVariable && (
              <AppField label="Due date">
                <SelectField
                  value={formatDueDate(dueDate.toISOString())}
                  placeholder="Select due date"
                  onPress={() => setShowDueDatePicker(true)}
                />
                {showDueDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onValueChange={(_event, selectedDate) => {
                      setShowDueDatePicker(false);
                      if (selectedDate) {
                        // Keep the original due time; only the day changes.
                        const next = new Date(dueDate);
                        next.setFullYear(selectedDate.getFullYear());
                        next.setMonth(selectedDate.getMonth());
                        next.setDate(selectedDate.getDate());
                        setDueDate(next);
                      }
                    }}
                  />
                )}
              </AppField>
            )}

            {isAmountVariable && (
              <AppField label="Amount" errorMessage={amountError ?? undefined}>
                <AppInput
                  placeholder="0.00"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setAmountError(null);
                  }}
                  error={!!amountError}
                  keyboardType="numeric"
                />
              </AppField>
            )}

            {errorMessage && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: FontSizes.small,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {errorMessage}
              </Text>
            )}

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isPending}
              style={{
                marginTop: height * 0.01,
                width: "100%",
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
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
