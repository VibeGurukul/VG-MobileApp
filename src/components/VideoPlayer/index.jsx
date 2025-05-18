import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayer = ({
  videoURL,
  onProgress = () => {},
  savedProgress = 0,
  autoLandscape = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const hasPerformedInitialSeek = useRef(false);

  useEffect(() => {
    const setOrientation = async () => {
      if (autoLandscape) {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
        } catch (error) {
          console.error("Failed to lock screen orientation:", error);
        }
      }
    };

    setOrientation();

    // Reset orientation when component unmounts
    return () => {
      if (autoLandscape) {
        ScreenOrientation.unlockAsync().catch((error) => {
          console.error("Failed to unlock screen orientation:", error);
        });
      }

      // Save progress when component unmounts
      if (player) {
        handleSaveProgress();
      }
    };
  }, [autoLandscape]);

  const saveProgress = (progress, duration) => {
    try {
      const progressPercentage =
        duration > 0 ? ((progress / duration) * 100).toFixed(2) : 0;
      onProgress(progressPercentage);
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleSaveProgress = () => {
    if (player && player.currentTime && player.duration) {
      // If the video is at the end (with a small threshold), save as 100%
      if (player.currentTime >= player.duration - 0.5) {
        onProgress(100);
      } else {
        saveProgress(player.currentTime, player.duration);
      }
    }
  };

  const player = useVideoPlayer(videoURL, async (player) => {
    player.loop = false; // Changed from true to false to detect end of video
    player.play();
    setIsPlaying(true);
    console.log("Player created");
  });

  useEventListener(player, "statusChange", ({ status, error }) => {
    if (status === "readyToPlay" && !hasPerformedInitialSeek.current) {
      if (savedProgress > 0 && player.duration > 0) {
        const seekTime = (savedProgress / 100) * player.duration;
        console.log(
          "Initial seek to:",
          seekTime,
          "from saved progress:",
          savedProgress
        );
        player.seekBy(seekTime);
        hasPerformedInitialSeek.current = true;
      }
    } else if (status === "playing") {
      setIsPlaying(true);
    } else if (status === "paused") {
      setIsPlaying(false);
      handleSaveProgress();
    } else if (status === "complete") {
      // Video completed, save progress as 100%
      setIsPlaying(false);
      onProgress(100);
    }
  });

  return (
    <VideoView
      style={styles.videoView}
      player={player}
      startsPictureInPictureAutomatically
      allowsFullscreen={false}
      allowsPictureInPicture
    />
  );
};

const styles = StyleSheet.create({
  videoView: {
    height: "100%",
    width: "100%",
  },
});

export default VideoPlayer;
