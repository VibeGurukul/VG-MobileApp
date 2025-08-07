import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Image,
  Linking,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Header from '../../../components/Header';
// import { colors } from '../../../assets/colors';
import { useAuth } from '../../../context/AuthContext';
import { API } from '../../../constants';
import {
  addBookmark,
  removeBookmark,
} from '../../../store/slices/bookmarkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../../../store/slices/cart-slice';
import Typography from '../../../library/components/Typography';
import LoadingSpinnerWebView from '../../../components/Loader';
import { useTheme } from '../../../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const WorkshopDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { addingToCart } = useSelector(state => state.cart);
  const state = useSelector(state => state.bookmark);
  const cartState = useSelector(state => state.cart);
  const params = route.params;
  const { colors } = useTheme();

  const [workshop, setWorkshop] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [workshopLoading, setWorkshopLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const { token, user } = useAuth();

  const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      padding: 20,
      boxShadow: `0 0 8px ${colors.cardShadow}`,
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
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      padding: screenWidth * 0.05,
      paddingBottom: 100,
    },
    courseTitle: {
      fontSize: screenWidth * 0.06,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.textPrimary,
      marginBottom: 20,
    },
    videoContainer: {
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: 20,
    },
    videoPlaceholder: {
      width: '100%',
      height: screenWidth * 0.5,
      backgroundColor: colors.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
    },
    placeholderText: {
      fontSize: screenWidth * 0.04,
      color: colors.textQuaternary,
    },
    metaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    metaText: {
      fontSize: screenWidth * 0.04,
      color: colors.textSecondary,
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
      backgroundColor: colors.surface,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
      backgroundColor: colors.black,
    },
    joinNowButton: {
      backgroundColor: colors.infoDark,
    },
    liveButton: {
      backgroundColor: colors.youtube,
    },
    cartButton: {
      backgroundColor: colors.secondary,
    },
    endedButton: {
      backgroundColor: colors.youtube,
    },
    bottomButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: screenWidth * 0.04,
    },
    continueButton: {
      backgroundColor: colors.success,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: screenWidth * 0.04,
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: screenWidth * 0.04,
      color: colors.textSecondary,
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
      color: colors.white,
      fontWeight: 'bold',
      fontSize: screenWidth * 0.04,
    },
    sectionHeading: {
      fontSize: screenWidth * 0.05,
      fontWeight: '800',
      color: colors.textSecondary,
      marginTop: 15,
      marginBottom: 10,
      textAlign: 'center',
    },
    sectionText: {
      fontSize: screenWidth * 0.035,
      color: colors.textTertiary,
      lineHeight: 22,
      textAlign: 'center',
    },
  });

  const checkIfEnrolled = async () => {
    try {
      const url = `${API.BASE_URL}/check/workshop?user_email=${user.email}&workshop_id=${params.workshop._id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setIsEnrolled(data.isEnrolled);
      setWorkshopLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const enrollNow = async () => {
    setEnrolling(true);
    try {
      const url = `${API.BASE_URL}/enroll/workshop`;
      const body = {
        user_email: user.email,
        workshop_id: workshop._id,
      };
      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setIsEnrolled(true);
      Alert.alert('Success', 'Successfully enrolled in the workshop!');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const getWorkshopDetails = async () => {
    setWorkshopLoading(true);
    try {
      const response = await axios.get(
        `${API.BASE_URL}/workshops/${params.workshop._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data;
      setWorkshop(data);
      await checkIfEnrolled();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load workshop details.');
    } finally {
      setWorkshopLoading(false);
    }
  };

  useEffect(() => {
    getWorkshopDetails();
  }, []);

  const checkIfBookmarked = () => {
    let hasBookmarked = state.bookmarked?.filter(bookmark => {
      return bookmark._id === workshop._id;
    });
    return hasBookmarked.length ? true : false;
  };

  const checkIfInCart = () => {
    if (cartState.length == 0) return;
    let inCart = cartState.cart?.filter(item => {
      return item?.workshop_id == workshop?._id;
    });
    return inCart.length ? true : false;
  };

  const onPressBookmark = () => {
    if (!checkIfBookmarked()) dispatch(addBookmark(workshop));
    else dispatch(removeBookmark(workshop?._id));
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    const inputDay = new Date(inputDate);
    inputDay.setHours(0, 0, 0, 0);
    const diffDays = Math.round((inputDay - today) / (1000 * 60 * 60 * 24));
    const timeString = inputDate.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (diffDays === 0) return `Today at ${timeString}`;
    if (diffDays === 1) return `Tomorrow at ${timeString}`;
    if (diffDays > 1 && diffDays < 7) {
      const weekday = inputDate.toLocaleString('en-US', { weekday: 'long' });
      return `${weekday} at ${timeString}`;
    }
    return inputDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const checkIfLive = () => {
    if (!workshop?.dates || !isEnrolled) return false;
    const currentTime = new Date();
    return workshop.dates.some(dateString => {
      const sessionStart = new Date(dateString);
      const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000);
      return currentTime >= sessionStart && currentTime <= sessionEnd;
    });
  };

  const checkIfEnded = () => {
    if (!workshop?.dates) return false;
    const now = new Date();
    return workshop.dates.every(dateString => {
      const sessionEnd = new Date(
        new Date(dateString).getTime() + 60 * 60 * 1000,
      );
      return now > sessionEnd;
    });
  };

  const handleJoinLive = () => {
    Linking.openURL(workshop?.meeting_link);
  };

  const handleAddToCart = async workshop => {
    if (isEnrolled) return;
    if (checkIfInCart()) {
      navigation.navigate('Cart');
      return;
    }
    try {
      const data = {
        workshop_id: workshop._id,
        price: workshop.price,
        short_title: workshop.short_title,
        preview_image: workshop.preview_image,
        title: workshop.title,
      };
      await dispatch(addToCartAsync(data)).unwrap();
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong.',
      );
    }
  };

  const renderActionButton = () => {
    const isLive = checkIfLive();
    const hasEnded = checkIfEnded();

    if (isLive) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('ZoomSdk')}
          style={[styles.bottomButton, styles.liveButton]}
        >
          <Typography style={styles.bottomButtonText}>Join Live</Typography>
        </TouchableOpacity>
      );
    }

    if (hasEnded) {
      return (
        <TouchableOpacity
          style={[styles.bottomButton, styles.endedButton]}
          disabled={true}
        >
          <Typography style={styles.bottomButtonText}>Ended</Typography>
        </TouchableOpacity>
      );
    }

    if (isEnrolled) {
      return (
        <TouchableOpacity style={[styles.bottomButton, styles.continueButton]}>
          <Typography style={styles.bottomButtonText}>View Upcoming</Typography>
        </TouchableOpacity>
      );
    }

    if (workshop.price === 0 || workshop.price === '0') {
      return (
        <TouchableOpacity
          onPress={enrollNow}
          style={[styles.bottomButton, styles.joinNowButton]}
        >
          {enrolling ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Typography style={styles.bottomButtonText}>Join Now</Typography>
          )}
        </TouchableOpacity>
      );
    }

    if (checkIfInCart()) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={[styles.bottomButton, styles.cartButton]}
        >
          <Typography style={styles.bottomButtonText}>Go To Cart</Typography>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => handleAddToCart(workshop)}
        style={[styles.bottomButton, styles.enrollButton]}
      >
        {addingToCart ? (
          <ActivityIndicator size={'small'} color={colors.white} />
        ) : (
          <Typography style={styles.bottomButtonText}>Add To Cart</Typography>
        )}
      </TouchableOpacity>
    );
  };

  if (workshopLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={`Namaste!`} onBack={() => navigation.goBack()} />
        <LoadingSpinnerWebView />
      </SafeAreaView>
    );
  }

  if (!workshop) {
    return (
      <View style={styles.container}>
        <Header title={`Namaste!`} onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Typography style={styles.errorText}>
            Failed to load workshop details
          </Typography>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={getWorkshopDetails}
          >
            <Typography style={styles.retryButtonText}>Retry</Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`Namaste!`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Typography style={styles.courseTitle}>{workshop.title}</Typography>

        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Image
              source={{ uri: workshop.preview_image }}
              width={'100%'}
              height={'100%'}
            />
          </View>
        </View>

        <Typography style={styles.priceText}>
          {workshop.price === 0 || workshop.price === '0'
            ? 'Free'
            : `₹${workshop.price}/-`}
        </Typography>

        <View style={styles.card}>
          <Typography style={styles.sectionHeading}>Description</Typography>
          <Typography style={styles.sectionText}>
            {workshop.description}
          </Typography>
          <Typography style={styles.sectionHeading}>Age</Typography>
          <Typography style={styles.sectionText}>{workshop.age}</Typography>

          <Typography style={styles.sectionHeading}>Dates</Typography>
          {workshop.dates &&
            workshop.dates.map(date => (
              <Typography key={date} style={styles.sectionText}>
                {formatDate(date)}
              </Typography>
            ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={onPressBookmark}
          style={styles.bookmarkButton}
        >
          <Icon
            name={checkIfBookmarked() ? 'bookmark' : 'bookmark-o'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        {workshop.price !== 'Coming Soon' && renderActionButton()}
      </View>
    </View>
  );
};

export default WorkshopDetails;
