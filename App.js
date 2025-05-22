import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import ToastManager from "toastify-react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store";

const RootStack = createStackNavigator();

const FadeTransition = {
  gestureDirection: "horizontal",
  transitionSpec: {
    open: { animation: "timing", config: { duration: 300 } },
    close: { animation: "timing", config: { duration: 300 } },
  },
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
};

const RootNavigation = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#fdbb2d" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, ...FadeTransition }}>
      {isLoading && <RootStack.Screen name="Splash" component={SplashScreen} />}
      {isAuthenticated ? (
        <RootStack.Screen name="App" component={AppStack} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStack} />
      )}

    </RootStack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigation />
            <ToastManager />
          </NavigationContainer>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff7961",
  },
});
