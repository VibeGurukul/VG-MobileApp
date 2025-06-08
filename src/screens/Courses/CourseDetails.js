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
import { addBookmark, removeBookmark } from '../../store/slices/bookmarkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToCartAsync } from '../../store/slices/cart-slice';
import LoadingSpinnerWebView from '../../components/Loader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseDetails = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const {
    addingToCart,
  } = useSelector((state) => state.cart);


  const state = useSelector(state => state.bookmark)
  const cartState = useSelector(state => state.cart)

  const params = route.params;
  const [firstName, setFirstName] = useState('');
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true); // New loading state for course API
  const [progressList, setProgressList] = useState([]);

  const { user, token } = useAuth();

  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const player = useVideoPlayer(course?.videos?.[0]?.url, player => {
    player.loop = true;
    player.play();
  });

  const getCourseDetails = async () => {
    setCourseLoading(true); // Start loading
    try {
      const response = await axios.get(`${API.BASE_URL}/courses/${params.course._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = response.data;

      setCourse(data)

    } catch (error) {
      console.log("error: ", error.response)
      Alert.alert('Error', 'Failed to load course details. Please try again.');
    } finally {
      setCourseLoading(false); // Stop loading
    }
  }

  useEffect(() => {
    getCourseDetails()
  }, []) // Remove course dependency to prevent infinite loop

  const checkIfBookmarked = () => {
    let hasBookmarked = state.bookmarked?.filter((bookmark) => {
      return bookmark._id === course._id
    });
    return hasBookmarked.length ? true : false
  }

  const checkIfInCart = () => {
    if (cartState.length == 0) return
    let inCart = cartState.cart?.filter((item) => {
      return item?.course_id == course?._id
    });
    return inCart.length ? true : false
  }

  useEffect(() => {
    checkIfInCart()
  }, [cartState, course])

  const onPressBookmark = () => {
    if (!checkIfBookmarked())
      dispatch(addBookmark(course))
    else dispatch(removeBookmark(course?._id));
  }

  const checkEnrollmentStatus = async (userEmail, userToken) => {
    if (!userToken || !course) return;

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
  }, [course]); // Add course as dependency so it runs after course is loaded

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

  const handleAddToCart = async (course) => {
    if (isEnrolled) return
    if (checkIfInCart()) {
      navigation.navigate("Cart");
      return;
    }
    setIsLoading(true)
    try {
      const data =
      {
        "course_id": course._id,
        "price": course.price,
        "short_title": course.short_title,
        "preview_image": course.preview_image,
        "title": course.title
      }
      await dispatch(addToCartAsync(data)).unwrap();
    } catch (error) {
      console.log("error: ", error)
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading screen while course is being fetched
  if (courseLoading) {
    return (
      <View style={styles.container}>
        <Header
          title={`Namaste!`}
          onBack={() => navigation.goBack()}
        />
        <LoadingSpinnerWebView />
      </View>
    );
  }

  // Show error state if course failed to load
  if (!course) {
    return (
      <View style={styles.container}>
        <Header
          title={`Namaste!`}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load course details</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={getCourseDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Namaste!`}
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

        <CourseTabs
          course={course}
          isEnrolled={isEnrolled}
          player={player}
          progressList={progressList}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={onPressBookmark}
          style={styles.bookmarkButton}
        >
          <Icon
            name={checkIfBookmarked() ? "bookmark" : "bookmark-o"}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        {loading ? (
          <TouchableOpacity onPress={{}} style={[styles.bottomButton]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <>
            {course.price != "Coming Soon" ? (
              <TouchableOpacity
                // onPress={() => handleEnroll(course._id)}
                onPress={() => handleAddToCart(course)}
                style={[
                  styles.bottomButton,
                  isEnrolled ? styles.continueButton : styles.enrollButton,
                ]}
              >
                {isLoading || addingToCart ? (
                  <ActivityIndicator size={"small"} color={colors.white} />
                ) : (
                  <Text style={styles.bottomButtonText}>
                    {isEnrolled
                      ? "Continue"
                      : checkIfInCart()
                        ? "Go To Cart"
                        : "Add To Cart"}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </>
        )}
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
  loadingText: {
    marginTop: 10,
    fontSize: screenWidth * 0.04,
    color: '#666',
  },
  errorText: {
    fontSize: screenWidth * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04,
  },
});

export default CourseDetails