import { StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';

const VideoPlayer = ({
  videoURL,
  onProgress = () => {},
  savedProgress = 0,
  autoLandscape = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const hasPerformedInitialSeek = useRef(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const setOrientation = () => {
      if (autoLandscape) {
        try {
          Orientation.lockToLandscape();
        } catch (error) {
          console.error('Failed to lock screen orientation:', error);
        }
      }
    };

    setOrientation();

    return () => {
      if (autoLandscape) {
        try {
          Orientation.lockToPortrait();
        } catch (error) {
          console.error('Failed to unlock screen orientation:', error);
        }
      }

      // Save progress when component unmounts
      handleSaveProgress();
    };
  }, [autoLandscape]);

  const saveProgress = (progress, videoDuration) => {
    try {
      const progressPercentage =
        videoDuration > 0 ? ((progress / videoDuration) * 100).toFixed(2) : 0;
      onProgress(progressPercentage);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleSaveProgress = () => {
    if (currentTime && duration) {
      // If the video is at the end (with a small threshold), save as 100%
      if (currentTime >= duration - 0.5) {
        onProgress(100);
      } else {
        saveProgress(currentTime, duration);
      }
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    console.log('Video loaded, duration:', data.duration);

    // Perform initial seek if we have saved progress
    if (
      savedProgress > 0 &&
      data.duration > 0 &&
      !hasPerformedInitialSeek.current
    ) {
      const seekTime = (savedProgress / 100) * data.duration;
      console.log(
        'Initial seek to:',
        seekTime,
        'from saved progress:',
        savedProgress,
      );
      videoRef.current?.seek(seekTime);
      hasPerformedInitialSeek.current = true;
    }
  };

  const onProgressUpdate = data => {
    setCurrentTime(data.currentTime);
  };

  const onEnd = () => {
    console.log('Video ended');
    setIsPlaying(false);
    onProgress(100);
  };

  const onPlaybackStateChanged = data => {
    setIsPlaying(data.isPlaying);
    if (!data.isPlaying) {
      handleSaveProgress();
    }
  };

  return (
    <Video
      ref={videoRef}
      source={{ uri: videoURL }}
      style={styles.videoView}
      paused={!isPlaying}
      resizeMode="contain"
      onLoad={onLoad}
      onProgress={onProgressUpdate}
      onEnd={onEnd}
      onPlaybackStateChanged={onPlaybackStateChanged}
      controls={true}
      onError={error => console.error('Video error:', error)}
      progressUpdateInterval={1000}
      allowsExternalPlayback={false}
      pictureInPicture={true}
      playInBackground={false}
    />
  );
};

const styles = StyleSheet.create({
  videoView: {
    height: '100%',
    width: '100%',
  },
});

export default VideoPlayer;
