import React from "react";
import { View, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar } from "react-native";
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
import LoadingSpinnerWebView from "./src/components/Loader";
import { colors } from "./src/assets/colors";
import { ZoomVideoSdkProvider } from "@zoom/react-native-videosdk";

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
      <LoadingSpinnerWebView />
    );
  }

  const ZOOM_CONFIG = {
    appType: 1, // Or your specific app type
    domain: 'zoom.us',
    enableLogDirPath: true,
    logLevel: 'info',
    // Add appGroupId for iOS if applicable:
    // appGroupId: '{Your Apple Group ID here}', // Required for iOS, but doesn't hurt Android
  };

  return (
    <ZoomVideoSdkProvider config={ZOOM_CONFIG}>
      <RootStack.Navigator screenOptions={{ headerShown: false, ...FadeTransition }}>
        {isLoading && <RootStack.Screen name="Splash" component={SplashScreen} />}
        {isAuthenticated ? (
          <RootStack.Screen name="App" component={AppStack} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </ZoomVideoSdkProvider>
  );
};

export default function App() {
  return (
    <>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle="light-content"
      />
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
    </>
  );
}

