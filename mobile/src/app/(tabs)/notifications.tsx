import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NotificationIcon from "@/assets/icons/notification.svg";
import { Styles } from "@/styles/stylesheets";
import { useTypography } from "@/hooks/useTypography";
import { useRefresh } from "@/hooks/useRefresh";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { FontWeights } from "@/styles/typography";
import {
  SCREEN_PADDING_TOP_RATIO,
  SCREEN_WIDTH_RATIO,
} from "@/constants/dimensions";
import { NotificationListSkeleton } from "@/components/Skeleton";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/services/notification/hooks";
import type { Notification } from "@/services/notification/types";
import {
  formatNotificationTime,
  getNotificationAppearance,
} from "@/utils/notification";

const PAGE_LIMIT = 20;

export default function Notifications() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const {
    notifications,
    isPending,
    errorMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useNotifications({ limit: PAGE_LIMIT });
  const { unreadCount, refetch: refetchUnreadCount } =
    useUnreadNotificationCount();
  const { markNotificationAsRead } = useMarkNotificationAsRead();
  const { markAllNotificationsAsRead, isPending: isMarkingAllAsRead } =
    useMarkAllNotificationsAsRead();
  const { deleteNotification } = useDeleteNotification();
  const { isRefreshing, onRefresh } = useRefresh([refetch, refetchUnreadCount]);

  // New notifications are created by the backend scheduler, so check again
  // whenever the tab is opened.
  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchUnreadCount();
    }, [refetch, refetchUnreadCount]),
  );

  const onPressNotification = (notification: Notification) => {
    if (!notification.read_at) {
      markNotificationAsRead(notification.id);
    }

    if (notification.recurring_payment_id) {
      router.push({
        pathname: "/recurring-payments/[id]",
        params: { id: notification.recurring_payment_id },
      });
    }
  };

  const onLongPressNotification = (notification: Notification) => {
    Alert.alert("Delete notification?", notification.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteNotification(notification.id, {
            onError: () => showToast("Failed to delete notification.", "error"),
          }),
      },
    ]);
  };

  const onPressMarkAllAsRead = () => {
    markAllNotificationsAsRead(undefined, {
      onError: () =>
        showToast("Failed to mark notifications as read.", "error"),
    });
  };

  return (
    <View
      style={[
        Styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + height * SCREEN_PADDING_TOP_RATIO,
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
          Notifications
        </Text>
        {unreadCount > 0 ? (
          <TouchableOpacity
            onPress={onPressMarkAllAsRead}
            disabled={isMarkingAllAsRead}
            style={{ opacity: isMarkingAllAsRead ? 0.5 : 1 }}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.small,
              }}
            >
              Mark all as read
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isPending ? (
        <View
          style={{
            width: width * 1,
            paddingVertical: height * 0.025,
          }}
        >
          <NotificationListSkeleton />
        </View>
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
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(notification) => notification.id}
          contentContainerStyle={{
            gap: 10,
            paddingVertical: height * 0.025,
            width: width * 1,
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.background}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                gap: 10,
                marginTop: height * 0.15,
              }}
            >
              <NotificationIcon
                color={colors.textMuted}
                width={40}
                height={40}
              />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: FontWeights.semibold,
                  fontSize: FontSizes.medium,
                }}
              >
                No notifications yet
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontWeight: FontWeights.medium,
                  fontSize: FontSizes.small,
                  textAlign: "center",
                }}
              >
                Reminders and payment updates will show up here.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginVertical: 10 }}
              />
            ) : null
          }
          renderItem={({ item: notification }) => {
            const isUnread = !notification.read_at;
            const { Icon, color, backgroundColor } = getNotificationAppearance(
              notification.type,
              colors,
            );

            return (
              <TouchableOpacity
                onPress={() => onPressNotification(notification)}
                onLongPress={() => onLongPressNotification(notification)}
                accessibilityHint="Long press to delete"
                style={[
                  Styles.flexRow,
                  {
                    alignItems: "flex-start",
                    borderColor: isUnread ? colors.primary : "none",
                    backgroundColor: isUnread ? colors.infoBg : "transparent",
                    gap: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  },
                ]}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon color={color} width={18} height={18} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={Styles.flexRow}>
                    <Text
                      style={{
                        flex: 1,
                        color: colors.textPrimary,
                        fontWeight: isUnread
                          ? FontWeights.bold
                          : FontWeights.semibold,
                        fontSize: FontSizes.medium,
                      }}
                    >
                      {notification.title}
                    </Text>
                    {isUnread ? (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: colors.primary,
                        }}
                      />
                    ) : null}
                  </View>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.small,
                    }}
                  >
                    {notification.body}
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontWeight: FontWeights.medium,
                      fontSize: FontSizes.tiny,
                      marginTop: 2,
                    }}
                  >
                    {formatNotificationTime(notification.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
