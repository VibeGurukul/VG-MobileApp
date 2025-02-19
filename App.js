import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

import AllCourses from "./src/screens/Courses/AllCourses";

const Stack = createStackNavigator();

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Welcome"); // Navigate to Welcome Screen
    }, 2000); // Show splash for 2 seconds
  }, []);

  return (
    <View style={styles.splashContainer}>
      <ActivityIndicator size="large" color="#fdbb2d" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false, gestureEnabled: false}}  />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AllCourses" component={AllCourses} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff7961",
  },
};
