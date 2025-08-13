import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
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
import { ZoomVideoSdkProvider } from "@zoom/react-native-videosdk";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import JailMonkey from 'jail-monkey';
import RNExitApp from 'react-native-exit-app';

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
  const { colors } = useTheme()

  // This effect runs once when the component mounts to check for a compromised device.
  useEffect(() => {
    // JailMonkey.trustFall() is a comprehensive check for both jailbroken/rooted devices
    // and mock location status.
    const isCompromised = JailMonkey.trustFall();

    if (isCompromised) {
      // If the device is compromised, show an alert and exit the app.
      // This is a critical security measure to protect your app and user data.
      Alert.alert(
        'Security Alert',
        'For your security, this application cannot be run on a compromised device. The app will now close.',
        [{ text: 'Exit', onPress: () => RNExitApp.exitApp() }],
        { cancelable: false } // User cannot dismiss the alert without exiting.
      );
    }
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinnerWebView />
    );
  }

  const ZOOM_CONFIG = {
    appType: 1,
    domain: 'zoom.us',
    enableLogDirPath: true,
    logLevel: 'info',
  };

  return (
    <ZoomVideoSdkProvider config={ZOOM_CONFIG}>
      <StatusBar
        backgroundColor={colors?.primary}
        barStyle="light-content"
      />
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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <AuthProvider>
              <NavigationContainer>
                <RootNavigation />
                <ToastManager />
              </NavigationContainer>
            </AuthProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
