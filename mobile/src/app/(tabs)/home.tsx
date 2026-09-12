import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import NotificationIcon from "@/assets/icons/notification.svg";
import WalletCardsIcon from "@/assets/icons/wallet-cards.svg";
import CalendarDaysIcon from "@/assets/icons/calendar-days.svg";
import HourglassIcon from "@/assets/icons/hourglass.svg";
import BanknoteIcon from "@/assets/icons/banknote.svg";
import { Styles } from "@/styles/stylesheets";
import { Colors } from "@/styles/colors";
import { FontWeights } from "@/styles/typography";
import { useTypography } from "@/hooks/useTypography";
import { OverviewCard } from "@/components/OverviewCard";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";

const mockUpcomingDues = [
  {
    id: 1,
    name: "Disney +",
    amount: "289",
    currency: "P",
    daysLeft: "Today",
    isFreeTrial: false,
  },
  {
    id: 2,
    name: "Canva Pro",
    amount: "299",
    currency: "P",
    daysLeft: "Tomorrow",
    isFreeTrial: true,
  },
  {
    id: 3,
    name: "Spotify",
    amount: "169",
    currency: "P",
    daysLeft: "3 days left",
    isFreeTrial: false,
  },
  {
    id: 4,
    name: "Youtube Premium",
    amount: "189",
    currency: "P",
    daysLeft: "5 days left",
    isFreeTrial: true,
  },
  {
    id: 5,
    name: "Netflix",
    amount: "249",
    currency: "P",
    daysLeft: "7 days left",
    isFreeTrial: false,
  },
];

export default function Home() {
  const { width, height } = useWindowDimensions();
  const FontSizes = useTypography();

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: Colors.background,
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
        <View style={{ gap: 3 }}>
          <Text
            style={{
              color: Colors.textPrimary,
              fontWeight: FontWeights.bold,
              fontSize: FontSizes.xLarge,
            }}
          >
            Good morning, Bohari!
          </Text>
          <Text
            style={{
              color: Colors.textSecondary,
              fontWeight: FontWeights.medium,
              fontSize: FontSizes.medium,
            }}
          >
            Here's your payments overview
          </Text>
        </View>
        <TouchableOpacity style={{ marginTop: height * 0.01 }}>
          <NotificationIcon />
        </TouchableOpacity>
      </View>
      <View
        style={[
          Styles.flexRow,
          { flexWrap: "wrap", gap: 15, marginTop: height * 0.04 },
        ]}
      >
        <OverviewCard
          title="Total Active Payments"
          value="0"
          backgroundColor={Colors.overviewBgBlue}
          color={Colors.overviewFontBlue}
          icon={<WalletCardsIcon color={Colors.primary} />}
        />
        <OverviewCard
          title="Upcoming This Week"
          value="0"
          backgroundColor={Colors.overviewBgGreen}
          color={Colors.overviewFontGreen}
          icon={<CalendarDaysIcon />}
        />
        <OverviewCard
          title="Free Trials Ending"
          value="0"
          backgroundColor={Colors.overviewBgYellow}
          color={Colors.overviewFontYellow}
          icon={<HourglassIcon />}
        />
        <OverviewCard
          title="Monthly Spending"
          value="0"
          backgroundColor={Colors.overviewBgPurple}
          color={Colors.overviewFontPurple}
          icon={<BanknoteIcon />}
        />
      </View>
      <View
        style={{ width: width * SCREEN_WIDTH_RATIO, marginTop: height * 0.035 }}
      >
        <View style={[Styles.flexRow, { justifyContent: "space-between" }]}>
          <Text
            style={{
              color: Colors.textPrimary,
              fontWeight: FontWeights.bold,
              fontSize: FontSizes.medium,
            }}
          >
            Upcoming Due
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: FontWeights.bold,
                fontSize: FontSizes.small,
              }}
            >
              View all {">"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderColor: Colors.border,
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            marginTop: height * 0.02,
            gap: 10,
          }}
        >
          {mockUpcomingDues.map((dues) => (
            <TouchableOpacity
              key={dues.id}
              style={[Styles.flexRow, { justifyContent: "space-between" }]}
            >
              <View
                style={[
                  Styles.flexRow,
                  {
                    gap: 7,
                    width: width * 0.25,
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <WalletCardsIcon color={Colors.textMuted} />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: FontSizes.small,
                    fontWeight: FontWeights.semibold,
                    color: Colors.textPrimary,
                  }}
                >
                  {dues.name}
                </Text>
                {dues.isFreeTrial && (
                  <View
                    style={{
                      padding: 3.5,
                      borderColor: Colors.overviewFontYellow,
                      borderWidth: 1,
                      backgroundColor: Colors.overviewBgYellow,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSizes.tiny,
                        fontWeight: FontWeights.semibold,
                      }}
                    >
                      Free Trial
                    </Text>
                  </View>
                )}
              </View>
              <View style={[Styles.flexRow, { gap: 10 }]}>
                <Text
                  style={{
                    fontSize: FontSizes.small,
                    fontWeight: FontWeights.semibold,
                    color:
                      dues.daysLeft === "Today" || dues.daysLeft === "Tomorrow"
                        ? Colors.danger
                        : Colors.warning,
                  }}
                >
                  {dues.daysLeft}
                </Text>
                <Text
                  style={{
                    fontSize: FontSizes.small,
                    fontWeight: FontWeights.bold,
                    color: Colors.textPrimary,
                  }}
                >
                  {dues.currency}
                  {dues.amount}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
