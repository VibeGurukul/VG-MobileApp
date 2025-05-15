import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import VideoPlayer from "../../components/VideoPlayer";
import axios from "axios";
import { API } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../assets/colors";
import Header from "../../components/Header";

const MainVideoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { videoURL, videoTitle, courseId, chapterId } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const headerTimeoutRef = useRef(null);
  const oldProg = useRef();

  const trackProgress = async (progress) => {
    if (oldProg.current >= Math.floor(progress)) return;
    oldProg.current = Math.floor(progress);
    const response = await axios.put(
      `${API.BASE_URL}/users/progress/${courseId}/${chapterId}`,
      {
        token: token,
        progress: progress,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("res: ", response.data);
  };

  const savedProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API.BASE_URL}/users/progress/${courseId}/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res saved Data: ", response.data.progress);
      oldProg.current = response.data.progress;
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle header visibility
  const startHeaderHideTimer = () => {
    // Clear any existing timeout
    if (headerTimeoutRef.current) {
      clearTimeout(headerTimeoutRef.current);
    }

    // Set a new timeout
    headerTimeoutRef.current = setTimeout(() => {
      setShowHeader(false);
    }, 1000);
  };

  // Handle screen tap
  const handleScreenTap = () => {
    setShowHeader(true);
    startHeaderHideTimer();
  };

  useEffect(() => {
    savedProgress();

    // Initial header hide timer
    startHeaderHideTimer();

    // Cleanup function
    return () => {
      if (headerTimeoutRef.current) {
        clearTimeout(headerTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.black,
        }}
      >
        {showHeader && (
          <View
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              zIndex: 10,
            }}
          >
            <Header title={videoTitle} onBack={() => navigation.goBack()} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size={"large"} color={colors.primary} />
        ) : (
          <VideoPlayer
            videoURL={videoURL}
            savedProgress={oldProg.current}
            onProgress={(progress) => trackProgress(progress)}
            autoLandscape={true}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default MainVideoScreen;

const styles = StyleSheet.create({});
