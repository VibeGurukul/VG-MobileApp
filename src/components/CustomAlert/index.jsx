import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../assets/colors";

const { width } = Dimensions.get("window");

const CustomAlert = ({
  visible,
  type = "info", // 'success', 'error', 'warning', 'info'
  title,
  message,
  primaryButton,
  secondaryButton,
  onDismiss,
  showCloseButton = true,
}) => {
  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark-circle",
          color: "#4CAF50",
          backgroundColor: "#E8F5E8",
        };
      case "error":
        return {
          name: "close-circle",
          color: "#F44336",
          backgroundColor: "#FFEBEE",
        };
      case "warning":
        return {
          name: "warning",
          color: "#FF9800",
          backgroundColor: "#FFF3E0",
        };
      default:
        return {
          name: "information-circle",
          color: colors.primary,
          backgroundColor: "#E3F2FD",
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onDismiss}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconConfig.backgroundColor },
            ]}
          >
            <Ionicons
              name={iconConfig.name}
              size={32}
              color={iconConfig.color}
            />
          </View>

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Message */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {secondaryButton && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={secondaryButton.onPress}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryButton.text}
                </Text>
              </TouchableOpacity>
            )}

            {primaryButton && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  secondaryButton && styles.primaryButtonWithSecondary,
                ]}
                onPress={primaryButton.onPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.primaryButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>
                    {primaryButton.text}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 26,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    overflow: "hidden",
  },
  primaryButtonWithSecondary: {
    flex: 1.2,
  },
  primaryButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomAlert;
