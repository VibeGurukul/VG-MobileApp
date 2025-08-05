import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  UIManager,
  Linking,
} from 'react-native';
import {
  useZoom,
  ZoomVideoSdkProvider,
  EventType,
  VideoAspect,
  ZoomView,
} from '@zoom/react-native-videosdk';
import Typography from '../../library/components/Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

// Configuration constants
const ZOOM_CONFIG = {
  appType: 1,
  domain: 'zoom.us',
  enableLogDirPath: true,
  logLevel: 'info',
};

const SESSION_CONFIG = {
  sessionName: 'Test',
  userName: 'Participant1',
  sessionIdleTimeoutMins: 10,
  sessionPassword: '',
  audioOptions: {
    connect: true,
    mute: false,
    autoAdjustSpeakerVolume: false,
  },
  videoOptions: {
    localVideoOn: true,
  },
};

// --- New MeetingTimer Component ---
const MeetingTimer = ({ sessionStartTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let timeInterval;
    if (sessionStartTime) {
      timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [sessionStartTime]);

  const formatDuration = startTime => {
    if (!startTime) return '00:00';
    const diff = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.recordingIndicator}>
      <View style={styles.recordingDot} />
      <Typography style={styles.recordingText}>
        {formatDuration(sessionStartTime)}
      </Typography>
    </View>
  );
};
// --- End MeetingTimer Component ---

// Main App Component with Provider
const ZoomVideoApp = () => {
  return (
    <ZoomVideoSdkProvider config={ZOOM_CONFIG}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <ZoomVideoCall />
      </SafeAreaView>
    </ZoomVideoSdkProvider>
  );
};

// Enhanced Call Component
const ZoomVideoCall = () => {
  const zoom = useZoom();
  const [users, setUsersInSession] = useState([]);
  const [isInSession, setIsInSession] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [showControlBar, setShowControlBar] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [myUserId, setMyUserId] = useState<any>(null); // New state for myUserId
  const listeners = useRef([]);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const controlBarAnim = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeApp();
    return () => {
      cleanup();
    };
  }, []);

  const initializeApp = async () => {
    await requestPermissions();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const cleanup = useCallback(() => {
    if (isInSession) {
      leaveSession();
    }
    listeners.current.forEach(listener => {
      try {
        listener.remove();
      } catch (error) {
        console.warn('Error removing listener:', error);
      }
    });
    listeners.current = [];
    setMyUserId(null); // Reset myUserId on cleanup
  }, [isInSession, leaveSession]); // Added leaveSession to dependencies

  const toggleControlBar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowControlBar(prev => !prev);
    const toValue = showControlBar ? 0 : 1;

    Animated.parallel([
      Animated.timing(controlBarAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        const cameraGranted =
          granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const audioGranted =
          granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (!cameraGranted || !audioGranted) {
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required for video calling. Please enable them in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Settings',
                onPress: () => {
                  Platform.OS === 'ios'
                    ? Linking.openURL('app-settings:')
                    : PermissionsAndroid.openSettings();
                },
              },
            ],
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  const setupEventListeners = () => {
    listeners.current.forEach(listener => {
      try {
        listener.remove();
      } catch (e) {
        console.warn('Error removing listener:', e);
      }
    });
    listeners.current = [];

    console.log('Setting up event listeners...');

    const sessionJoin = zoom.addListener(EventType.onSessionJoin, async () => {
      console.log('✅ Session joined successfully');
      setIsConnecting(false);
      setConnectionError(null);
      setSessionStartTime(new Date());

      try {
        const mySelf = await zoom.session.getMySelf();
        const remoteUsers = await zoom.session.getRemoteUsers();
        console.log('Session participants:', {
          mySelf: mySelf?.userName,
          myUserId: mySelf?.userId, // Log myUserId
          remoteUsers: remoteUsers?.length || 0,
        });
        console.log('myself: ', mySelf?.userId);

        setMyUserId(mySelf?.userId); // Store myUserId
        setUsersInSession([mySelf, ...remoteUsers]);
        setIsInSession(true);
        setIsVideoOn(SESSION_CONFIG.videoOptions.localVideoOn);
        setIsAudioOn(
          SESSION_CONFIG.audioOptions.connect &&
            !SESSION_CONFIG.audioOptions.mute,
        );
      } catch (error) {
        console.error('Error handling session join:', error);
        setConnectionError('Failed to initialize session');
      }
    });
    listeners.current.push(sessionJoin);

    const userJoin = zoom.addListener(EventType.onUserJoin, async event => {
      console.log('👤 User joined:', event);
      try {
        const { remoteUsers } = event;
        const mySelf = await zoom.session.getMySelf();
        setUsersInSession([mySelf, ...remoteUsers]);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } catch (error) {
        console.error('Error handling user join:', error);
      }
    });
    listeners.current.push(userJoin);

    const userLeave = zoom.addListener(EventType.onUserLeave, async event => {
      console.log('👋 User left:', event);
      try {
        const { remoteUsers } = event;
        const mySelf = await zoom.session.getMySelf();
        setUsersInSession([mySelf, ...remoteUsers]);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } catch (error) {
        console.error('Error handling user leave:', error);
      }
    });
    listeners.current.push(userLeave);

    const sessionLeave = zoom.addListener(EventType.onSessionLeave, reason => {
      console.log('📞 Session left. Reason:', JSON.stringify(reason));
      setIsInSession(false);
      setUsersInSession([]);
      setIsConnecting(false);
      setConnectionError(null);
      setSessionStartTime(null);
      setMyUserId(null); // Reset myUserId when session leaves
      cleanup();
    });
    listeners.current.push(sessionLeave);

    const videoStatusChange = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      event => {
        console.log('🎥 Video status changed:', event);
        if (event.changedUsers) {
          event.changedUsers.forEach(user => {
            if (user.isMyself) {
              setIsVideoOn(user.videoStatus?.isOn || false);
            }
          });
          setUsersInSession(prevUsers =>
            prevUsers.map(user =>
              user.userId === event.changedUsers[0].userId
                ? { ...user, videoStatus: event.changedUsers[0].videoStatus }
                : user,
            ),
          );
        }
      },
    );
    listeners.current.push(videoStatusChange);

    const audioStatusChange = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      event => {
        console.log('🎤 Audio status changed:', event);
        if (event.changedUsers) {
          event.changedUsers.forEach(user => {
            if (user.isMyself) {
              setIsAudioOn(!user.audioStatus?.isMuted || false);
            }
          });
          setUsersInSession(prevUsers =>
            prevUsers.map(user =>
              user.userId === event.changedUsers[0].userId
                ? { ...user, audioStatus: event.changedUsers[0].audioStatus }
                : user,
            ),
          );
        }
      },
    );
    listeners.current.push(audioStatusChange);

    const errorListener = zoom.addListener(EventType.onError, error => {
      console.error('❌ Zoom SDK Error:', error);
      setConnectionError(
        `Error: ${error.errorType || 'Unknown error occurred'}`,
      );
      setIsConnecting(false);
    });
    listeners.current.push(errorListener);

    console.log(`📱 Total listeners registered: ${listeners.current.length}`);
  };

  const join = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      setConnectionError(null);

      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        setIsConnecting(false);
        return;
      }

      console.log('Setting up event listeners...');
      setupEventListeners();

      // IMPORTANT: Replace this with your actual generated SDK JWT token
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiQ3RYTWpGWG5jb2NNUElpZjdwZmVqYlJISDhiYlBUemVRcjZxIiwicm9sZV90eXBlIjoxLCJ0cGMiOiJUZXN0IiwiaWF0IjoxNzUzMjgzNDQ4LCJleHAiOjE3NTMyODcwNDh9.SBmmQv0YOsn34spD4RJpxB9Ajghc9VHJodZEwRisFKA';

      console.log('Joining session with config:', {
        ...SESSION_CONFIG,
        token: token,
      });

      const joinResult = await zoom.joinSession({
        ...SESSION_CONFIG,
        token: token,
      });

      console.log('Join session request sent, result:', joinResult);

      setTimeout(() => {
        if (isConnecting && !isInSession) {
          console.warn('Session join timeout - no response after 30 seconds');
          setIsConnecting(false);
          setConnectionError(
            'Connection timeout. Please check your token and network connection. (Is your token valid?)',
          );
        }
      }, 30000);
    } catch (error) {
      console.error('Failed to join session:', error);
      setIsConnecting(false);
      setConnectionError(error.message || 'Failed to join session');

      Alert.alert(
        'Connection Error',
        `Unable to join the session.\n\n${
          error.message ||
          'Please check your internet connection and verify your token.'
        }`,
        [
          { text: 'Retry', onPress: () => join() },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    }
  };

  const leaveSession = useCallback(() => {
    Alert.alert(
      'End Session',
      'Are you sure you want to leave the session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          onPress: async () => {
            try {
              if (isInSession) {
                await zoom.leaveSession(false);
              }
              setIsInSession(false);
              setUsersInSession([]);
              setIsConnecting(false);
              setConnectionError(null);
              setSessionStartTime(null);
              setMyUserId(null); // Reset myUserId on leaving
              console.log('Left session');
            } catch (error) {
              console.error('Error leaving session:', error);
              Alert.alert('Error', 'Failed to leave session gracefully.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  }, [isInSession, zoom]);

  const toggleVideo = async () => {
    try {
      if (isVideoOn) {
        await zoom.videoHelper.stopVideo();
        setIsVideoOn(false);
      } else {
        await zoom.videoHelper.startVideo();
        setIsVideoOn(true);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (error) {
      console.error('Failed to toggle video:', error);
      Alert.alert('Error', 'Failed to toggle video. Please try again.');
    }
  };

  const toggleAudio = async () => {
    try {
      if (myUserId) {
        if (isAudioOn) {
          console.log('my user id1 ', myUserId);
          await zoom.audioHelper.muteAudio(myUserId);
          setIsAudioOn(false);
        } else {
          await zoom.audioHelper.unmuteAudio(myUserId);
          setIsAudioOn(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } else {
        console.warn('Cannot toggle audio: myUserId is not available.');
      }
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      Alert.alert('Error', 'Failed to toggle audio. Please try again.');
    }
  };

  const ConnectionStatus = () => {
    if (isConnecting) {
      return (
        <View style={styles.connectionStatus}>
          <IconAwesome
            name="circle-notch"
            size={16}
            color="#FFC107"
            style={styles.spinnerIcon}
          />
          <Typography style={styles.connectionStatusText}>
            Connecting to session...
          </Typography>
        </View>
      );
    }

    if (connectionError) {
      return (
        <View style={[styles.connectionStatus, styles.errorStatus]}>
          <Icon
            name="error-outline"
            size={18}
            color="#FF5722"
            style={styles.spinnerIcon}
          />
          <Typography style={styles.connectionStatusText}>
            {connectionError}
          </Typography>
        </View>
      );
    }

    return null;
  };

  // Meeting Header Component
  const MeetingHeader = ({ sessionStartTime }) => (
    <Animated.View
      style={[
        styles.meetingHeader,
        {
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: headerAnim,
        },
      ]}
    >
      <View style={styles.headerLeft}>
        <Icon name="group" size={20} color="#e0e0e0" />
        <Typography style={styles.headerText}>
          {users.length} participant{users.length !== 1 ? 's' : ''}
        </Typography>
      </View>
      <View style={styles.headerCenter}>
        <MeetingTimer sessionStartTime={sessionStartTime} />
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="more-vert" size={24} color="#e0e0e0" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // Video Grid Component
  const VideoGrid = () => {
    const renderVideoTile = (user, index) => {
      let tileStyle = {};
      if (users.length === 1) {
        tileStyle = { width: width - 16, height: height * 0.7 };
      } else if (users.length === 2) {
        tileStyle = { width: (width - 24) / 2, height: height * 0.35 };
      } else if (users.length <= 4) {
        tileStyle = { width: (width - 32) / 2, height: height * 0.25 };
      } else {
        // Fallback or more complex grid for > 4 users
        // This logic seems simplified for a larger number of users, might need adjustment
        const itemsPerRow = Math.min(3, Math.floor((width - 16) / 150));
        tileStyle = {
          width: (width - 16 - 8 * (itemsPerRow - 1)) / itemsPerRow,
          height: ((width - 16 - 8 * (itemsPerRow - 1)) / itemsPerRow) * 0.75,
        }; // Example: dynamic sizing
      }

      return (
        <View key={user.userId} style={[styles.videoTile, tileStyle]}>
          <ZoomView
            userId={user.userId}
            style={styles.zoomVideoView}
            fullScreen={true}
            videoAspect={VideoAspect.Original}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.videoTileOverlay}
          >
            <View style={styles.participantInfo}>
              <Typography style={styles.participantName} numberOfLines={1}>
                {user.userName || `User ${index + 1}`}
              </Typography>
              <View style={styles.participantStatus}>
                {user.audioStatus?.isMuted && (
                  <Icon name="mic-off" size={14} color="#f44336" />
                )}
                {!user.videoStatus?.isOn && (
                  <Icon name="videocam-off" size={14} color="#f44336" />
                )}
              </View>
            </View>
          </LinearGradient>
          {user.isMyself && (
            <View style={styles.selfIndicator}>
              <Typography style={styles.selfIndicatorText}>You</Typography>
            </View>
          )}
        </View>
      );
    };

    return (
      <ScrollView contentContainerStyle={styles.videoGridContent}>
        <View style={styles.videoGridInner}>{users.map(renderVideoTile)}</View>
      </ScrollView>
    );
  };

  // Professional Control Bar
  const ControlBar = () => (
    <Animated.View
      style={[
        styles.controlBar,
        {
          transform: [
            {
              translateY: controlBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          opacity: controlBarAnim,
        },
      ]}
    >
      <View style={styles.controlSection}>
        {/* Audio Control */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            !isAudioOn && styles.controlButtonMuted,
          ]}
          onPress={toggleAudio}
          activeOpacity={0.7}
        >
          <Icon
            name={isAudioOn ? 'mic' : 'mic-off'}
            size={24}
            color={isAudioOn ? '#ffffff' : '#ff5252'}
          />
          <Typography style={styles.controlButtonText}>
            {isAudioOn ? 'Mute' : 'Unmute'}
          </Typography>
        </TouchableOpacity>

        {/* Video Control */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            !isVideoOn && styles.controlButtonMuted,
          ]}
          onPress={toggleVideo}
          activeOpacity={0.7}
        >
          <Icon
            name={isVideoOn ? 'videocam' : 'videocam-off'}
            size={24}
            color={isVideoOn ? '#ffffff' : '#ff5252'}
          />
          <Typography style={styles.controlButtonText}>
            {isVideoOn ? 'Stop Video' : 'Start Video'}
          </Typography>
        </TouchableOpacity>

        {/* Screen Share */}
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
          <Icon name="screen-share" size={24} color="#ffffff" />
          <Typography style={styles.controlButtonText}>Share</Typography>
        </TouchableOpacity>

        {/* Participants */}
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
          <Icon name="group" size={24} color="#ffffff" />
          {users.length > 0 && (
            <View style={styles.participantBadge}>
              <Typography style={styles.participantBadgeText}>
                {users.length}
              </Typography>
            </View>
          )}
          <Typography style={styles.controlButtonText}>Participants</Typography>
        </TouchableOpacity>
      </View>

      {/* Leave Button */}
      <TouchableOpacity
        style={styles.leaveButton}
        onPress={leaveSession}
        activeOpacity={0.8}
      >
        <Icon name="call-end" size={24} color="#ffffff" />
        <Typography style={styles.leaveButtonText}>Leave</Typography>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render session view
  if (isInSession) {
    return (
      <View style={styles.meetingContainer}>
        <MeetingHeader sessionStartTime={sessionStartTime} />
        <ConnectionStatus />
        {/* Main Video Area */}
        <TouchableOpacity
          style={styles.videoArea}
          activeOpacity={1}
          onPress={toggleControlBar}
        >
          {users.length > 0 ? (
            <VideoGrid />
          ) : (
            <View style={styles.loadingVideoContainer}>
              <Icon name="videocam" size={48} color="#666" />
              <Typography style={styles.loadingVideoText}>
                Waiting for others to join...
              </Typography>
            </View>
          )}
        </TouchableOpacity>
        {showControlBar && <ControlBar />}
      </View>
    );
  }

  // Join interface
  return (
    <LinearGradient
      colors={['#1a1a2e', '#2c3a50', '#0a0a0a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <BackgroundElements />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Typography style={styles.title}>Vibe Gurukul</Typography>
          <Typography style={styles.subtitle}>
            Welcome to Your Workshop Session
          </Typography>
        </Animated.View>

        <Animated.View style={[styles.statusCard, { opacity: fadeAnim }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isConnecting ? '#FFC107' : '#28a745' },
                ]}
              />
              <Typography style={styles.statusTitle}>
                {isConnecting ? 'Initiating Connection' : 'Ready to Join'}
              </Typography>
            </View>
            <Typography style={styles.currentTimeText}>
              {new Date().toLocaleTimeString()}
            </Typography>
          </View>

          <View style={styles.sessionInfo}>
            <Typography style={styles.sessionName}>
              Session: {SESSION_CONFIG.sessionName}
            </Typography>
            <Typography style={styles.sessionDetails}>
              Organizer: {SESSION_CONFIG.userName} (You)
            </Typography>
            <Typography style={styles.sessionDetails}>
              Duration: Max {SESSION_CONFIG.sessionIdleTimeoutMins} minutes
            </Typography>
            {/* Display the current user's ID here if available */}
            {myUserId && (
              <Typography style={styles.sessionDetails}>
                Your User ID: {myUserId}
              </Typography>
            )}
          </View>
        </Animated.View>

        <ConnectionStatus />

        <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
          <VideoPlaceholder text="Your video preview will appear here" />
        </Animated.View>

        <Animated.View
          style={[styles.controlsContainer, { opacity: fadeAnim }]}
        >
          <TouchableOpacity
            style={[
              styles.joinButton,
              isConnecting && styles.joinButtonDisabled,
            ]}
            onPress={join}
            activeOpacity={0.8}
            disabled={isConnecting}
          >
            <View style={styles.joinButtonContent}>
              <IconAwesome
                name={isConnecting ? 'circle-notch' : 'video'}
                size={20}
                color="#ffffff"
                solid={isConnecting}
              />
              <Typography style={styles.joinButtonText}>
                {isConnecting ? 'Connecting...' : 'Join Session Now'}
              </Typography>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

// Helper Components (unchanged)
const BackgroundElements = () => (
  <View style={styles.backgroundOrbs}>
    <View style={styles.floatingOrb1} />
    <View style={styles.floatingOrb2} />
    <View style={styles.floatingOrb3} />
  </View>
);

const VideoPlaceholder = ({ text }) => (
  <View style={styles.videoPlaceholder}>
    <View style={styles.videoIcon}>
      <Icon name="videocam" size={40} color="#888" />
    </View>
    <Typography style={styles.videoPlaceholderText}>{text}</Typography>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  // Meeting Styles
  meetingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    top: 0,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  headerText: {
    color: '#e0e0e0',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },

  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f44336',
    marginRight: 6,
  },

  recordingText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  headerButton: {
    padding: 6,
  },

  videoArea: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoGridContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 8,
  },
  videoGridInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoTile: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    margin: 4,
  },

  zoomVideoView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  videoTileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },

  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  participantName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 5,
  },

  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  selfIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    zIndex: 1,
  },

  selfIndicatorText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  loadingVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },

  loadingVideoText: {
    color: '#a0a0a0',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },

  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 10,
  },

  controlSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
  },

  controlButton: {
    minWidth: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
    paddingVertical: 5,
  },

  controlButtonMuted: {
    backgroundColor: 'rgba(244, 67, 54, 0.25)',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },

  participantBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#2196f3',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  participantBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  leaveButton: {
    width: 70,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  leaveButtonText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },

  container: {
    flex: 1,
  },
  backgroundOrbs: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingOrb1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(139, 69, 255, 0.15)',
    top: -80,
    right: -80,
    opacity: 0.8,
  },
  floatingOrb2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    bottom: 120,
    left: -50,
    opacity: 0.6,
  },
  floatingOrb3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    top: height * 0.35,
    right: 30,
    opacity: 0.7,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 25,
  },
  scrollContent: {
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: height * 0.95,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: height * 0.08,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  connectionStatus: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.25)',
  },
  errorStatus: {
    backgroundColor: 'rgba(255, 87, 34, 0.15)',
    borderColor: 'rgba(255, 87, 34, 0.25)',
  },
  connectionStatusText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  spinnerIcon: {
    marginRight: 8,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 15,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  statusTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#ffffff',
  },
  currentTimeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  sessionInfo: {
    paddingTop: 15,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  sessionDetails: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 3,
  },
  videoContainer: {
    minHeight: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 25,
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoPlaceholderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '500',
  },
  controlsContainer: {
    paddingBottom: 10,
  },
  joinButton: {
    backgroundColor: '#007bff',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    marginBottom: 10,
  },
  joinButtonDisabled: {
    backgroundColor: 'rgba(0, 123, 255, 0.5)',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  joinButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
});

export default ZoomVideoApp;
