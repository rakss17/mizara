import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import { FontWeights } from "@/styles/typography";
import CircleCheckIcon from "@/assets/icons/circle-check.svg";
import CircleInfoIcon from "@/assets/icons/info.svg";
import CircleXIcon from "@/assets/icons/circle-x.svg";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg";

export type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const TOAST_DURATION = 3000;
const ANIMATION_DURATION = 200;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      nextId.current += 1;
      setToast({ id: nextId.current, type, message });
    },
    [],
  );

  const hideToast = useCallback((id: number) => {
    setToast((current) => (current?.id === id ? null : current));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <ToastView key={toast.id} toast={toast} onHide={hideToast} />}
    </ToastContext.Provider>
  );
};

const ToastView = ({
  toast,
  onHide,
}: {
  toast: Toast;
  onHide: (id: number) => void;
}) => {
  const { colors } = useTheme();
  const FontSizes = useTypography();
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(0));

  const hide = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(({ finished }) => finished && onHide(toast.id));
  }, [progress, onHide, toast.id]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(hide, TOAST_DURATION);

    return () => clearTimeout(timeout);
  }, [progress, hide]);

  const accentColor = {
    success: colors.success,
    error: colors.danger,
    info: colors.info,
    warning: colors.warning,
  }[toast.type];

  const accentBgColor = {
    success: colors.successBg,
    error: colors.dangerBg,
    info: colors.infoBg,
    warning: colors.warningBg,
  }[toast.type];

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          top: insets.top + 10,
          opacity: progress,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable
        onPress={hide}
        style={[
          styles.toast,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={{
            borderRadius: 999,
            backgroundColor: accentBgColor,
            padding: 10,
          }}
        >
          {toast.type === "success" && (
            <CircleCheckIcon width={20} height={20} color={accentColor} />
          )}
          {toast.type === "error" && (
            <CircleXIcon width={20} height={20} color={accentColor} />
          )}
          {toast.type === "info" && (
            <CircleInfoIcon width={20} height={20} color={accentColor} />
          )}
          {toast.type === "warning" && (
            <TriangleAlertIcon width={20} height={20} color={accentColor} />
          )}
        </View>

        <Text
          style={{
            color: colors.textPrimary,
            fontWeight: FontWeights.medium,
            fontSize: FontSizes.small,
          }}
        >
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  toast: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    maxWidth: 480,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
