import { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import NotificationIcon from "@/assets/icons/notification.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import ArrowUpDownIcon from "@/assets/icons/arrow-up-down.svg";
import WalletCardsIcon from "@/assets/icons/wallet-cards.svg";
import { Styles } from "@/styles/stylesheets";
import { useTypography } from "@/hooks/useTypography";
import { useTheme } from "@/contexts/ThemeContext";
import { FontWeights } from "@/styles/typography";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { SearchBar } from "@/components/SearchBar";
import {
  RecurringPaymentsFilterModal,
  hasActiveFilters,
  type RecurringPaymentFilters,
} from "@/components/RecurringPaymentsFilterModal";
import {
  RecurringPaymentsSortMenu,
  hasActiveSort,
  type RecurringPaymentSort,
} from "@/components/RecurringPaymentsSortMenu";
import { FreeTrialBadge } from "@/components/FreeTrialBadge";
import { useRecurringPayments } from "@/services/recurring-payment/hooks";
import { useCategories } from "@/services/category/hooks";
import type { RecurringPayment } from "@/services/recurring-payment/types";
import {
  formatAmount,
  formatDueDate,
  formatDueStatus,
  getDueStatusColor,
} from "@/utils/recurring-payment";

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_LIMIT = 100;

export default function RecurringPayments() {
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<RecurringPaymentFilters>({});
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [sort, setSort] = useState<RecurringPaymentSort>({});
  const { categories } = useCategories();
  const { recurringPayments, isPending, errorMessage } = useRecurringPayments({
    page: 1,
    limit: PAGE_LIMIT,
    search: debouncedSearch || undefined,
    sort_by: sort.sort_by,
    sort_order: sort.sort_order,
    ...filters,
    is_archived: filters.is_archived ?? false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search]);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const getCategoryName = (payment: RecurringPayment) =>
    (payment.category_id && categoryNameById.get(payment.category_id)) ||
    "Uncategorized";

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: height * 0.01,
          justifyContent: "flex-start",
        },
      ]}
    >
      <View
        style={[
          Styles.flexRow,
          {
            width: width * SCREEN_WIDTH_RATIO,
            justifyContent: "space-between",
            alignItems: "flex-start",
          },
        ]}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.xLarge,
          }}
        >
          Recurring Payments
        </Text>
        <TouchableOpacity style={{ marginTop: height * 0.01 }}>
          <NotificationIcon />
        </TouchableOpacity>
      </View>
      <View
        style={[
          Styles.flexRow,
          {
            width: width * SCREEN_WIDTH_RATIO,
            gap: 10,
            marginTop: height * 0.025,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or description..."
            style={{ width: "100%" }}
          />
        </View>
        <TouchableOpacity
          onPress={() => setIsFilterModalVisible(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: hasActiveFilters(filters)
              ? colors.primary
              : colors.border,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FilterIcon
            color={
              hasActiveFilters(filters) ? colors.primary : colors.textMuted
            }
            width={18}
            height={18}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsSortMenuVisible(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: hasActiveSort(sort) ? colors.primary : colors.border,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowUpDownIcon
            color={hasActiveSort(sort) ? colors.primary : colors.textMuted}
            width={18}
            height={18}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          Styles.flexColumn,
          {
            width: width * SCREEN_WIDTH_RATIO,
            gap: 10,
            paddingVertical: height * 0.02,
          },
        ]}
      >
        {isPending ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : errorMessage ? (
          <Text
            style={{
              color: colors.danger,
              fontWeight: FontWeights.medium,
              fontSize: FontSizes.small,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {errorMessage}
          </Text>
        ) : recurringPayments.length === 0 ? (
          <Text
            style={{
              color: colors.textSecondary,
              fontWeight: FontWeights.medium,
              fontSize: FontSizes.small,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            No recurring payments found.
          </Text>
        ) : (
          recurringPayments.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={[
                Styles.flexRow,
                {
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  gap: 10,
                  padding: 10,
                },
              ]}
            >
              <WalletCardsIcon color={colors.textMuted} />
              <View
                style={[
                  Styles.flexRow,
                  {
                    justifyContent: "space-between",
                    flex: 1,
                  },
                ]}
              >
                <View>
                  <View
                    style={[
                      Styles.flexRow,
                      {
                        width: width * 0.35,
                        gap: 5,
                        justifyContent: "flex-start",
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: colors.textPrimary,
                        fontWeight: FontWeights.semibold,
                        fontSize: FontSizes.medium,
                      }}
                    >
                      {payment.name}
                    </Text>
                    {payment.is_free_trial && <FreeTrialBadge />}
                  </View>

                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                    }}
                  >
                    {payment.billing_cycle}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                    }}
                  >
                    {getCategoryName(payment)}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: FontWeights.semibold,
                      fontSize: FontSizes.medium,
                      textAlign: "right",
                    }}
                  >
                    {formatAmount(payment.amount)}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                      textAlign: "right",
                    }}
                  >
                    {formatDueDate(payment.due_date)}
                  </Text>
                  <Text
                    style={{
                      color: getDueStatusColor(payment.due_date, colors),
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                      textAlign: "right",
                    }}
                  >
                    {formatDueStatus(payment.due_date)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <RecurringPaymentsFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        filters={filters}
        onApply={setFilters}
        categories={categories}
      />

      <RecurringPaymentsSortMenu
        visible={isSortMenuVisible}
        onClose={() => setIsSortMenuVisible(false)}
        value={sort}
        onSelect={setSort}
      />
    </View>
  );
}
