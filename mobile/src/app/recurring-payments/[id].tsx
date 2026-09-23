import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import WalletCardsIcon from "@/assets/icons/wallet-cards.svg";
import { useTypography } from "@/hooks/useTypography";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { Badge, Variant } from "@/components/Badge";
import {
  useDeleteRecurringPayment,
  useRecurringPayment,
  useUpdateRecurringPayment,
} from "@/services/recurring-payment/hooks";
import { useCategories } from "@/services/category/hooks";
import {
  formatAmount,
  formatDueDate,
  formatDueStatus,
  getDueStatusColor,
} from "@/utils/recurring-payment";

export default function RecurringPaymentDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { categories } = useCategories();
  const { recurringPayment, isPending, errorMessage } = useRecurringPayment(id);
  const {
    updateRecurringPayment,
    isPending: isUpdating,
    errorMessage: updateErrorMessage,
  } = useUpdateRecurringPayment();
  const {
    deleteRecurringPayment,
    isPending: isDeleting,
    errorMessage: deleteErrorMessage,
  } = useDeleteRecurringPayment();

  const isMutating = isUpdating || isDeleting;
  const actionErrorMessage = updateErrorMessage ?? deleteErrorMessage;

  const categoryName =
    (recurringPayment?.category_id &&
      categories.find(
        (category) => category.id === recurringPayment.category_id,
      )?.name) ||
    "Uncategorized";

  const onToggleArchive = () => {
    if (!recurringPayment) return;

    updateRecurringPayment({
      id: recurringPayment.id,
      payload: { is_archived: !recurringPayment.is_archived },
    });
  };

  const onDelete = () => {
    if (!recurringPayment) return;

    Alert.alert(
      "Delete recurring payment",
      `Are you sure you want to delete "${recurringPayment.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteRecurringPayment(recurringPayment.id, {
              onSuccess: () => router.back(),
            }),
        },
      ],
    );
  };

  const details = recurringPayment
    ? [
        { label: "Type", value: recurringPayment.type },
        { label: "Category", value: categoryName },
        { label: "Billing cycle", value: recurringPayment.billing_cycle },
        {
          label: "Due date",
          value: `${formatDueDate(recurringPayment.due_date)}, ${new Date(
            recurringPayment.due_date,
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        },
        {
          label: "Auto-renew",
          value: recurringPayment.is_auto_renew ? "On" : "Off",
        },
        {
          label: "Free trial",
          value: recurringPayment.is_free_trial ? "Yes" : "No",
        },
        { label: "Currency", value: recurringPayment.currency },
        {
          label: "Created",
          value: formatDueDate(recurringPayment.created_at),
        },
      ]
    : [];

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: colors.background,
          justifyContent: "flex-start",
          paddingTop: insets.top + height * 0.02,
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
          Payment Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {isPending ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : errorMessage || !recurringPayment ? (
        <Text
          style={{
            color: colors.danger,
            fontWeight: FontWeights.medium,
            fontSize: FontSizes.small,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {errorMessage ?? "Recurring payment not found."}
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={[
            Styles.flexColumn,
            {
              width: width * SCREEN_WIDTH_RATIO,
              gap: height * 0.02,
              paddingBottom: height * 0.03,
            },
          ]}
        >
          <View
            style={[
              Styles.flexColumn,
              {
                width: "100%",
                gap: 6,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <WalletCardsIcon
              color={
                recurringPayment.is_archived
                  ? colors.textMuted
                  : colors.textSecondary
              }
              width={36}
              height={36}
            />
            <View style={[Styles.flexRow, { gap: 5 }]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: colors.textPrimary,
                  fontWeight: FontWeights.semibold,
                  fontSize: FontSizes.large,
                  flexShrink: 1,
                }}
              >
                {recurringPayment.name}
              </Text>
            </View>
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: FontWeights.bold,
                fontSize: FontSizes.xLarge,
              }}
            >
              {formatAmount(recurringPayment.amount)}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: FontWeights.medium,
                fontSize: FontSizes.small,
              }}
            >
              {recurringPayment.billing_cycle}
            </Text>
            {!recurringPayment.is_archived && (
              <Text
                style={{
                  color: getDueStatusColor(
                    recurringPayment.due_date,
                    colors,
                    "Active",
                  ),
                  fontWeight: FontWeights.medium,
                  fontSize: FontSizes.small,
                }}
              >
                {formatDueStatus(recurringPayment.due_date)}
              </Text>
            )}
            <View style={[Styles.flexRow, { gap: 5 }]}>
              {recurringPayment.is_free_trial ? (
                <Badge variant={Variant.FreeTrial} />
              ) : null}
              {recurringPayment.is_archived ? (
                <Badge variant={Variant.Archived} />
              ) : null}
            </View>
          </View>

          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              backgroundColor: colors.surface,
            }}
          >
            {details.map((detail, index) => (
              <View
                key={detail.label}
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    gap: 10,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: FontWeights.medium,
                    fontSize: FontSizes.small,
                  }}
                >
                  {detail.label}
                </Text>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: FontWeights.semibold,
                    fontSize: FontSizes.small,
                    textAlign: "right",
                    flexShrink: 1,
                  }}
                >
                  {detail.value}
                </Text>
              </View>
            ))}
          </View>

          {recurringPayment.description ? (
            <View
              style={{
                width: "100%",
                gap: 6,
                padding: 15,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                backgroundColor: colors.surface,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontWeight: FontWeights.medium,
                  fontSize: FontSizes.small,
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: FontWeights.medium,
                  fontSize: FontSizes.small,
                }}
              >
                {recurringPayment.description}
              </Text>
            </View>
          ) : null}

          {actionErrorMessage && (
            <Text
              style={{
                color: colors.danger,
                fontSize: FontSizes.small,
                textAlign: "center",
                width: "100%",
              }}
            >
              {actionErrorMessage}
            </Text>
          )}

          <TouchableOpacity
            onPress={onToggleArchive}
            disabled={isMutating}
            style={{
              width: "100%",
              paddingVertical: 15,
              backgroundColor: colors.primary,
              borderRadius: 6,
              alignItems: "center",
            }}
          >
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
                {recurringPayment.is_archived
                  ? "Reactivate"
                  : "Mark as Cancelled"}
              </Text>
            )}
          </TouchableOpacity>
          {recurringPayment.is_archived && (
            <TouchableOpacity
              onPress={onDelete}
              disabled={isMutating}
              style={{
                width: "100%",
                paddingVertical: 12,
                backgroundColor: "transparent",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.danger,
                alignItems: "center",
              }}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.danger} />
              ) : (
                <Text
                  style={{
                    color: colors.danger,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  Delete
                </Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}
