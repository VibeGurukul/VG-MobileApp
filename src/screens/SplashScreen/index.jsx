import React from "react";
import { View, StyleSheet } from "react-native";
import LoadingSpinnerWebView from "../../components/Loader";

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LoadingSpinnerWebView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
