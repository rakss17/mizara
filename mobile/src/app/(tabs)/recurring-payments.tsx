import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
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
  type FilterCategory,
  type RecurringPaymentFilters,
} from "@/components/RecurringPaymentsFilterModal";
import {
  RecurringPaymentsSortMenu,
  hasActiveSort,
  type RecurringPaymentSort,
} from "@/components/RecurringPaymentsSortMenu";
import { FreeTrialBadge } from "@/components/FreeTrialBadge";

// TODO: replace with categories fetched from GET /category once the
// category service is wired up on mobile.
const MOCK_CATEGORIES: FilterCategory[] = [
  { id: "streaming", name: "Streaming" },
  { id: "utilities", name: "Utilities" },
  { id: "insurance", name: "Insurance" },
  { id: "housing-rent", name: "Housing & Rent" },
  { id: "food-dining", name: "Food & Dining" },
  { id: "transportation", name: "Transportation" },
  { id: "health-fitness", name: "Health & Fitness" },
  { id: "software-subscriptions", name: "Software & Subscriptions" },
  { id: "entertainment", name: "Entertainment" },
  { id: "other", name: "Other" },
];

type RecurringPayment = {
  id: string;
  name: string;
  frequency: string;
  category_id: string;
  category: string;
  amount: string;
  due_date: string;
  status: string;
  is_free_trial: boolean;
};

// TODO: replace with recurring payments fetched from GET /recurring-payment
// once the recurring payments service is wired up on mobile.
const MOCK_RECURRING_PAYMENTS: RecurringPayment[] = [
  {
    id: "1",
    name: "Disney +",
    frequency: "Monthly",
    category_id: "entertainment",
    category: "Entertainment",
    amount: "P289",
    due_date: "Sep. 15, 2026",
    status: "Due Today",
    is_free_trial: false,
  },
  {
    id: "2",
    name: "Netflix",
    frequency: "Monthly",
    category_id: "streaming",
    category: "Streaming",
    amount: "P549",
    due_date: "Sep. 18, 2026",
    status: "Due in 3 days",
    is_free_trial: false,
  },
  {
    id: "3",
    name: "Spotify Premium",
    frequency: "Monthly",
    category_id: "entertainment",
    category: "Entertainment",
    amount: "P149",
    due_date: "Sep. 20, 2026",
    status: "Due in 5 days",
    is_free_trial: true,
  },
  {
    id: "4",
    name: "Meralco",
    frequency: "Monthly",
    category_id: "utilities",
    category: "Utilities",
    amount: "P2,340",
    due_date: "Sep. 10, 2026",
    status: "Overdue",
    is_free_trial: false,
  },
  {
    id: "5",
    name: "PLDT Home Fiber",
    frequency: "Monthly",
    category_id: "utilities",
    category: "Utilities",
    amount: "P1,699",
    due_date: "Sep. 25, 2026",
    status: "Due in 10 days",
    is_free_trial: false,
  },
  {
    id: "6",
    name: "Pag-IBIG MP2",
    frequency: "Monthly",
    category_id: "insurance",
    category: "Insurance",
    amount: "P1,000",
    due_date: "Sep. 30, 2026",
    status: "Due in 15 days",
    is_free_trial: false,
  },
  {
    id: "7",
    name: "Condo Rent",
    frequency: "Monthly",
    category_id: "housing-rent",
    category: "Housing & Rent",
    amount: "P15,000",
    due_date: "Oct. 1, 2026",
    status: "Due in 16 days",
    is_free_trial: false,
  },
  {
    id: "8",
    name: "Adobe Creative Cloud",
    frequency: "Yearly",
    category_id: "software-subscriptions",
    category: "Software & Subscriptions",
    amount: "P11,999",
    due_date: "Dec. 5, 2026",
    status: "Due in 81 days",
    is_free_trial: true,
  },
];

export default function RecurringPayments() {
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<RecurringPaymentFilters>({});
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [sort, setSort] = useState<RecurringPaymentSort>({});

  const filteredPayments = MOCK_RECURRING_PAYMENTS.filter((payment) =>
    payment.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

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
        {filteredPayments.length === 0 ? (
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
          filteredPayments.map((payment) => (
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
                    {payment.frequency}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                    }}
                  >
                    {payment.category}
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
                    {payment.amount}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                      textAlign: "right",
                    }}
                  >
                    {payment.due_date}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                      textAlign: "right",
                    }}
                  >
                    {payment.status}
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
        categories={MOCK_CATEGORIES}
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
