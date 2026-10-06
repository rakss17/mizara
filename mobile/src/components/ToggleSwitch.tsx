import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

const TRACK_WIDTH = 45;
const TRACK_HEIGHT = 25;
const THUMB_SIZE = 20;
const THUMB_OVERFLOW = -2;
const THUMB_LEFT_OFF = -THUMB_OVERFLOW;
const THUMB_LEFT_ON = TRACK_WIDTH - THUMB_SIZE + THUMB_OVERFLOW;
const THUMB_TRAVEL_DISTANCE = THUMB_LEFT_ON - THUMB_LEFT_OFF;

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  loading?: boolean;
};

export const ToggleSwitch = ({
  value,
  onValueChange,
  loading = false,
}: ToggleSwitchProps) => {
  const { colors } = useTheme();
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, THUMB_TRAVEL_DISTANCE],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={loading}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, busy: loading, disabled: loading }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: value ? colors.primary : colors.border,
            opacity: loading ? 0.6 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: colors.surface,
              transform: [{ translateX }],
            },
          ]}
        >
          {loading && (
            <ActivityIndicator
              size="small"
              style={styles.spinner}
              color={value ? colors.primary : colors.textSecondary}
            />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    left: THUMB_LEFT_OFF,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  spinner: {
    transform: [{ scale: 0.7 }],
  },
});
