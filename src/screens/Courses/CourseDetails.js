import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Header from '../../components/Header';
import CourseTabs from '../../components/CourseTabs';
import { colors } from '../../assets/colors';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../constants';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Toast } from 'toastify-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseDetails = ({ route, navigation }) => {
  const { course } = route.params;
  const [firstName, setFirstName] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressList, setProgressList] = useState([]);

  const { user, token } = useAuth()

  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const player = useVideoPlayer(course?.videos[0]?.url, player => {
    player.loop = true;
    player.play();
  });



  const checkEnrollmentStatus = async (userEmail, userToken) => {
    if (!userToken) return;

    try {
      const response = await axios.get(
        `${API.BASE_URL}/check-enroll`,
        {
          params: { user_email: userEmail, course_id: course._id },
        }
      );

      if (response.data.isEnrolled) {
        setIsEnrolled(true);
        getSectionProgress()
        setLoading(false);
      }
      else {
        setIsEnrolled(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      setLoading(false);
    }
  };



  const getSectionProgress = async () => {
    try {
      let response = await axios.get(
        `${API.BASE_URL}/users/progress/${course?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("resP: ", response.data)
      setProgressList(response.data);
    } catch (error) {
      console.log("error is: ", error.response.data, " test: ", `${API.BASE_URL}/users/progress/${course?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const keys = ["full_name", "email", "access_token"];
        const storedValues = await AsyncStorage.multiGet(keys);

        const storedFullName = storedValues[0][1];
        const storedEmail = storedValues[1][1];
        const storedToken = storedValues[2][1];

        if (storedFullName) {
          const firstName = storedFullName.split(" ")[0];
          setFirstName(firstName);
        }

        if (storedEmail && storedToken) {
          setEmail(storedEmail);
          checkEnrollmentStatus(storedEmail, storedToken);
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };



    fetchUserData();
  }, []);

  const handleEnroll = async (courseId) => {
    if (isEnrolled) return
    setIsLoading(true)
    try {
      const data = {
        user_email: user.email,
        course_id: courseId
      }
      const response = await axios.post(`${API.BASE_URL}/enroll`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (response.data) {
        Toast.success("You have successfully enrolled in the course.");
        await checkEnrollmentStatus(user.email, token);
      } else {
        console.log("err")
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }



  return (
    <View style={styles.container}>
      <Header
        title={`Namaste ${firstName || "Guest"}!`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Course Title */}
        <Text style={styles.courseTitle}>{course.title}</Text>

        {/* Preview Video Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <VideoView
              style={{ height: "100%", width: "100%" }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        </View>

        {/* Rating and Duration */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>⭐ 4.5 Rating</Text>
          <Text style={styles.metaText}>⏳ 8 Hours Duration</Text>
        </View>

        {/* Price */}
        <Text style={styles.priceText}>₹{course.price}/-</Text>

        <CourseTabs course={course} isEnrolled={isEnrolled} player={player} progressList={progressList} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon name="bookmark" size={24} color={colors.primary} />
        </TouchableOpacity>
        {loading ? <TouchableOpacity
          onPress={() => handleEnroll(course._id)}
          style={[
            styles.bottomButton,
          ]}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </TouchableOpacity> : <>
          {course.price != "Coming Soon" ? (
            <TouchableOpacity
              onPress={() => handleEnroll(course._id)}
              style={[
                styles.bottomButton,
                isEnrolled ? styles.continueButton : styles.enrollButton,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size={"small"} color={colors.white} />
              ) : (
                <Text style={styles.bottomButtonText}>
                  {isEnrolled ? "Continue" : "Enroll Now"}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: screenWidth * 0.05, // 5% of screen width
    paddingBottom: 100,
  },
  courseTitle: {
    fontSize: screenWidth * 0.06, // 6% of screen width
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  videoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: '100%',
    height: screenWidth * 0.5, // 50% of screen width
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  placeholderText: {
    fontSize: screenWidth * 0.04, // 4% of screen width
    color: '#666',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metaText: {
    fontSize: screenWidth * 0.04, // 4% of screen width
    color: '#666',
  },
  priceText: {
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookmarkButton: {
    padding: 15,
  },
  bottomButton: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  enrollButton: {
    backgroundColor: '#000',
  },
  bottomButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04, // 4% of screen width
  },
  continueButton: {
    backgroundColor: '#32CD32',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CourseDetails;