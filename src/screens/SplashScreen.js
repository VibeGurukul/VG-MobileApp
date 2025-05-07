import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SplashScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#fdbb2d" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ff7961",
    },
});
