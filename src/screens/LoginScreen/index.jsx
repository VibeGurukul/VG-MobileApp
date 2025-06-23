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
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PasswordInput from "../../components/PasswordInput";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../assets/colors";
import { API } from "../../constants";

const LoginScreen = () => {
  const route = useRoute();
  const { email } = route.params || {};
  const { login } = useAuth();
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API.BASE_URL}/login/`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "X-Client-Type": "mobile",
          },
        }
      );

      if (response.data.access_token) {
        await login(response.data);
      } else {
        setErrorMessage(
          "Failed to Login. Please try again with the correct password."
        );
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error?.response?.data || error?.message || error
      );

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setErrorMessage("Network error. Please try again.");
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome To Vibe Gurukul</Text>
        <Text style={styles.secondaryText}>Hi, Welcome Back 👋</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          editable={false}
        />

        <PasswordInput
          password={password}
          setPassword={setPassword}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!password || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ForgotPassword", { ...route.params })
          }
        >
          <Text
            style={{
              textAlign: "right",
              color: "blue",
              fontSize: 14,
              marginVertical: 10,
              marginRight: 10,
            }}
          >
            Forget Password?
          </Text>
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

export default LoginScreen;
