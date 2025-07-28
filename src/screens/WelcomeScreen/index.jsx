import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { isValidEmail } from "../../utils";
import { colors } from "../../assets/colors";
import { API } from "../../constants";

const WelcomeScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const checkEmailRegistration = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API.BASE_URL}/check-email?email=${email}`
      );

      if (response.data.email_registered) {
        navigation.navigate("LoginScreen", { email });
      } else {
        navigation.navigate("RegisterScreen", { email });
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome To Vibe Gurukul</Text>
        <Text style={styles.secondaryText}>Enter your details below:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={"gray"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={checkEmailRegistration}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue With Email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        <Text style={styles.secondaryText}>Sign In With</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Icon name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 20,
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
    color: "#000",
  },
  secondaryText: {
    fontSize: 20,
    textAlign: "center",
    color: "#1c1c1c",
    fontWeight: "400",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 30,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: "#FFC04D",
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  socialButton: {
    marginHorizontal: 10,
  },
});

export default WelcomeScreen;
