import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useRouter } from "expo-router";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { RecurringPaymentForm } from "@/components/RecurringPaymentForm";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import type { CreateRecurringPaymentFormData } from "@/schemas/recurring-payment";
import { useCreateRecurringPayment } from "@/services/recurring-payment/hooks";
import type { CreateRecurringPaymentPayload } from "@/services/recurring-payment/types";

export default function AddRecurringPayment() {
  const router = useRouter();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { createRecurringPayment, isPending, errorMessage } =
    useCreateRecurringPayment();

  const onSubmit = (data: CreateRecurringPaymentFormData) => {
    const payload: CreateRecurringPaymentPayload = {
      name: data.name,
      type: data.type,
      description: data.description || undefined,
      amount: Number(data.amount),
      currency: "PHP",
      billing_cycle: data.billing_cycle,
      is_auto_renew: data.is_auto_renew,
      is_archived: false,
      is_free_trial: data.is_free_trial,
      due_date: data.due_date.toISOString(),
      category_id: data.category_id,
    };

    createRecurringPayment(payload, {
      onSuccess: () => router.back(),
    });
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
          Add Recurring Payment
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <RecurringPaymentForm
        defaultValues={{
          name: "",
          type: undefined as unknown as CreateRecurringPaymentFormData["type"],
          description: "",
          amount: "",
          billing_cycle:
            undefined as unknown as CreateRecurringPaymentFormData["billing_cycle"],
          is_auto_renew: true,
          is_free_trial: false,
          due_date: undefined as unknown as Date,
          category_id: "",
        }}
        onSubmit={onSubmit}
        isPending={isPending}
        errorMessage={errorMessage}
        resetLabel="Clear"
      />
    </KeyboardAwareScrollView>
  );
}
