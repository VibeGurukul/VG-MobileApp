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
import { API } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import InfoModal from "../../../components/Modal/InfoModal";
import axios from "axios";

const UpdateMobile = ({ navigation }) => {
  const [newMobile, setNewMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState({
    title: "",
    message: "",
  });

  const { updateMobile } = useAuth();

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleUpdateMobile = async () => {
    setErrors({});

    const newErrors = {};
    if (!newMobile) {
      newErrors.newMobile = "Mobile number is required";
    } else if (!validateMobile(newMobile)) {
      newErrors.newMobile = "Please enter a valid 10-digit mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await updateMobile(newMobile);

      if (result.success) {
        setMessage({
          title: "Success",
          message: "Mobile number updated successfully!",
        });
        setModalVisible(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
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
        subtitle={"Update Mobile"}
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
                <Typography style={styles.infoIconText}>📱</Typography>
              </View>
              <Typography style={styles.infoTitle}>
                Update Your Mobile Number
              </Typography>
              <Typography style={styles.infoSubtitle}>
                Please enter the new mobile number you'd like to use.
              </Typography>
            </View>

            {/* New Mobile Input */}
            <View style={styles.inputGroup}>
              <Typography style={styles.label}>New Mobile Number</Typography>
              <View
                style={[
                  styles.inputContainer,
                  errors.newMobile && styles.inputError,
                ]}
              >
                <Typography style={styles.countryCode}>+91</Typography>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new mobile number"
                  placeholderTextColor={colors.textTertiary}
                  value={newMobile}
                  onChangeText={setNewMobile}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {errors.newMobile && (
                <Typography style={styles.errorText}>
                  {errors.newMobile}
                </Typography>
              )}
            </View>

            {/* Security Note */}
            {/* <View style={styles.securityNote}>
              <Typography style={styles.securityIcon}>🔒</Typography>
              <Typography style={styles.securityText}>
                For security purposes, you may receive an OTP to verify this
                change.
              </Typography>
            </View> */}
          </View>
        </ScrollView>

        {/* Update Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              loading && styles.updateButtonDisabled,
            ]}
            onPress={handleUpdateMobile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Typography style={styles.updateButtonText}>
                Update Mobile Number
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateMobile;

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
  countryCode: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  securityNote: {
    flexDirection: "row",
    backgroundColor: "#FFF8E7",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: "#B8860B",
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
