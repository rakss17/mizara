import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useLocalSearchParams, useRouter } from "expo-router";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { RecurringPaymentForm } from "@/components/RecurringPaymentForm";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import type { CreateRecurringPaymentFormData } from "@/schemas/recurring-payment";
import {
  useRecurringPayment,
  useUpdateRecurringPayment,
} from "@/services/recurring-payment/hooks";
import type { UpdateRecurringPaymentPayload } from "@/services/recurring-payment/types";

export default function EditRecurringPayment() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const {
    recurringPayment,
    isPending: isLoading,
    errorMessage: loadErrorMessage,
  } = useRecurringPayment(id);
  const { updateRecurringPayment, isPending, errorMessage } =
    useUpdateRecurringPayment();

  const onSubmit = (data: CreateRecurringPaymentFormData) => {
    const payload: UpdateRecurringPaymentPayload = {
      name: data.name,
      type: data.type,
      description: data.description ?? "",
      amount: Number(data.amount),
      billing_cycle: data.billing_cycle,
      is_auto_renew: data.is_auto_renew,
      is_free_trial: data.is_free_trial,
      due_date: data.due_date.toISOString(),
      category_id: data.category_id,
    };

    updateRecurringPayment(
      { id, payload },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        Styles.container,
        {
          backgroundColor: colors.background,
          justifyContent: "flex-start",
          paddingTop: height * 0.02,
          paddingBottom: height * 0.01,
        },
      ]}
    >
      <View
        style={[
          Styles.flexRow,
          {
            width: width * SCREEN_WIDTH_RATIO,
            gap: 10,
            justifyContent: "space-between",
            paddingBottom: height * 0.02,
          },
        ]}
      >
        <TouchableOpacity style={{ width: 24 }} onPress={() => router.back()}>
          <ArrowLeftIcon color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.large,
          }}
        >
          Edit Recurring Payment
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : loadErrorMessage || !recurringPayment ? (
        <Text
          style={{
            color: colors.danger,
            fontWeight: FontWeights.medium,
            fontSize: FontSizes.small,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {loadErrorMessage ?? "Recurring payment not found."}
        </Text>
      ) : (
        <RecurringPaymentForm
          defaultValues={{
            name: recurringPayment.name,
            type: recurringPayment.type,
            description: recurringPayment.description ?? "",
            amount: String(Number(recurringPayment.amount)),
            billing_cycle: recurringPayment.billing_cycle,
            is_auto_renew: recurringPayment.is_auto_renew,
            is_free_trial: recurringPayment.is_free_trial,
            due_date: new Date(recurringPayment.due_date),
            category_id: recurringPayment.category_id ?? "",
          }}
          onSubmit={onSubmit}
          isPending={isPending}
          errorMessage={errorMessage}
          resetLabel="Reset"
        />
      )}
    </KeyboardAwareScrollView>
  );
}
