import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import CloseIcon from "@/assets/icons/x.svg";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

/** A bottom sheet that explains a value, e.g. what a "Variable" type means. */
export const InfoModal = ({
  visible,
  onClose,
  title,
  message,
}: InfoModalProps) => {
  const FontSizes = useTypography();
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
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
            paddingBottom: 30,
          }}
        >
          <View
            style={[
              Styles.flexRow,
              {
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
              {title}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <Text
            style={{
              paddingHorizontal: 20,
              paddingTop: 6,
              color: colors.textSecondary,
              fontWeight: FontWeights.medium,
              fontSize: FontSizes.small,
              lineHeight: FontSizes.small * 1.5,
            }}
          >
            {message}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
