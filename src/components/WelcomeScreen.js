import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      {/* White Card Section */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome To Vibe Gurukul</Text>
        <Text style={styles.subtitle}>Enter your details below:</Text>

        <TextInput
          placeholder="Email Address"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue With Email</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or Sign In With</Text>

        <TouchableOpacity>
          <Text style={styles.facebookText}>facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff6f61",
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    marginTop: 50,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    marginTop: -30, // To overlap the top section
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#fdbb2d",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 15,
    color: "#888",
  },
  facebookText: {
    color: "#1877F2",
    fontWeight: "bold",
    fontSize: 16,
  },
});
