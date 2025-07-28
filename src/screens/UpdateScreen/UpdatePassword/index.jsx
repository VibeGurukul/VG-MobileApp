import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Typography from "../../../library/components/Typography";
import Header from "../../../components/Header";
import { colors } from "../../../assets/colors";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { API } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import InfoModal from "../../../components/Modal/InfoModal";
import { Toast } from "toastify-react-native";

const UpdatePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState({
    title: "",
    message: "",
  });

  const { token } = useAuth();

  const validatePassword = (password) => {
    // Password should be at least 8 characters long
    return password.length >= 8;
  };

  const handleUpdatePassword = async () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${API.BASE_URL}/users/me/password`,
        {
          token: token,
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      setMessage({
        title: "Password updated successfully",
        message: "You have successfully updated your password",
      });
      setModalVisible(true);
    } catch (error) {
      Toast.error(
        error.response?.data?.detail ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <InfoModal
        title={message.title}
        description={message.message}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
      />
      <Header
        title={"Namaste!"}
        subtitle={"Update Password"}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Typography style={styles.infoIconText}>🔒</Typography>
              </View>
              <Typography style={styles.infoTitle}>
                Update Your Password
              </Typography>
              <Typography style={styles.infoSubtitle}>
                Please enter your current password and choose a new secure
                password.
              </Typography>
            </View>

            {/* Current Password Input */}
            <View style={styles.inputGroup}>
              <Typography style={styles.label}>Current Password</Typography>
              <View
                style={[
                  styles.inputContainer,
                  errors.currentPassword && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textTertiary}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("current")}
                >
                  <Icon
                    name={showCurrentPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <Typography style={styles.errorText}>
                  {errors.currentPassword}
                </Typography>
              )}
            </View>

            {/* New Password Input */}
            <View style={styles.inputGroup}>
              <Typography style={styles.label}>New Password</Typography>
              <View
                style={[
                  styles.inputContainer,
                  errors.newPassword && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textTertiary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("new")}
                >
                  <Icon
                    name={showNewPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Typography style={styles.errorText}>
                  {errors.newPassword}
                </Typography>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Typography style={styles.label}>Confirm New Password</Typography>
              <View
                style={[
                  styles.inputContainer,
                  errors.confirmPassword && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("confirm")}
                >
                  <Icon
                    name={showConfirmPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Typography style={styles.errorText}>
                  {errors.confirmPassword}
                </Typography>
              )}
            </View>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Typography style={styles.securityIcon}>🛡️</Typography>
              <Typography style={styles.securityText}>
                Choose a strong password with at least 8 characters for better
                security.
              </Typography>
            </View>
          </View>
        </ScrollView>

        {/* Update Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              loading && styles.updateButtonDisabled,
            ]}
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Typography style={styles.updateButtonText}>
                Update Password
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#F8F9FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EAFF",
  },
  infoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIconText: {
    fontSize: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: "center",
  },
  infoSubtitle: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: "center",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: "#FEF2F2",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  eyeIconText: {
    fontSize: 18,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  securityNote: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: "#0369A1",
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonDisabled: {
    backgroundColor: colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
