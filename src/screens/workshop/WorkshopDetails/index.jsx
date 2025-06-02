import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import Header from "../../../components/Header";
import { colors } from "../../../assets/colors";
import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../constants";
import { Toast } from "toastify-react-native";
import {
  addBookmark,
  removeBookmark,
} from "../../../store/slices/bookmarkSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../../store/slices/cart-slice";
import Typography from "../../../library/components/Typography";

const { width: screenWidth } = Dimensions.get("window");

const WorkshopDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { addingToCart } = useSelector((state) => state.cart);

  const state = useSelector((state) => state.bookmark);
  const cartState = useSelector((state) => state.cart);

  const params = route.params;

  const [workshop, setWorkshop] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true);

  const { user, token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const getWorkshopDetails = async () => {
    setCourseLoading(true);
    try {
      const response = await axios.get(
        `${API.BASE_URL}/workshops/${params.workshop._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      setWorkshop(data);
    } catch (error) {
      console.log("error: ", error);
      Alert.alert(
        "Error",
        "Failed to load workshop details. Please try again."
      );
    } finally {
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    getWorkshopDetails();
  }, []);

  const checkIfBookmarked = () => {
    let hasBookmarked = state.bookmarked?.filter((bookmark) => {
      return bookmark._id === workshop._id;
    });
    return hasBookmarked.length ? true : false;
  };

  const checkIfInCart = () => {
    if (cartState.length == 0) return;
    let inCart = cartState.cart?.filter((item) => {
      return item?.workshop_id == workshop?._id;
    });
    return inCart.length ? true : false;
  };

  useEffect(() => {
    checkIfInCart();
  }, [cartState, workshop]);

  const onPressBookmark = () => {
    if (!checkIfBookmarked()) dispatch(addBookmark(workshop));
    else dispatch(removeBookmark(workshop?._id));
  };

  const checkEnrollmentStatus = async (userEmail, userToken) => {
    if (!userToken || !workshop) return;

    try {
      const response = await axios.get(`${API.BASE_URL}/check-enroll`, {
        params: { user_email: userEmail, course_id: workshop._id },
      });

      if (response.data.isEnrolled) {
        setIsEnrolled(true);
        setLoading(false);
      } else {
        setIsEnrolled(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const keys = ["full_name", "email", "access_token"];
        const storedValues = await AsyncStorage.multiGet(keys);

        const storedFullName = storedValues[0][1];
        const storedEmail = storedValues[1][1];
        const storedToken = storedValues[2][1];

        if (storedEmail && storedToken) {
          checkEnrollmentStatus(storedEmail, storedToken);
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    fetchUserData();
  }, [workshop]);

  const formatDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedDate;
  };

  const handleAddToCart = async (workshop) => {
    if (isEnrolled) return;
    if (checkIfInCart()) {
      navigation.navigate("Cart");
      return;
    }
    setIsLoading(true);
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
      console.log("error: ", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (courseLoading) {
    return (
      <View style={styles.container}>
        <Header title={`Namaste!`} onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  // Show error state if workshop failed to load
  if (!workshop) {
    return (
      <View style={styles.container}>
        <Header title={`Namaste!`} onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load workshop details</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={getWorkshopDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`Namaste!`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Course Title */}
        <Text style={styles.courseTitle}>{workshop.title}</Text>

        {/* Preview Video Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Image
              source={{ uri: workshop.preview_image }}
              width={"100%"}
              height={"100%"}
            />
          </View>
        </View>

        {/* Rating and Duration */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>⭐ 4.5 Rating</Text>
          <Text style={styles.metaText}>⏳ 8 Hours Duration</Text>
        </View>

        {/* Price */}
        <Text style={styles.priceText}>₹{workshop.price}/-</Text>

        <View style={styles.card}>
          <Typography style={styles.sectionHeading}>Description</Typography>
          <Typography style={styles.sectionText}>
            {workshop.description}
          </Typography>
          <Typography style={styles.sectionHeading}>Age</Typography>
          <Typography style={styles.sectionText}>{workshop.age}</Typography>

          <Typography style={styles.sectionHeading}>Dates</Typography>
          {workshop.dates &&
            workshop.dates.map((date) => (
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
            {workshop.price != "Coming Soon" ? (
              <TouchableOpacity
                onPress={() => handleAddToCart(workshop)}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
    backgroundColor: "#F0F0F0",
  },
  content: {
    padding: screenWidth * 0.05, // 5% of screen width
    paddingBottom: 100,
  },
  courseTitle: {
    fontSize: screenWidth * 0.06, // 6% of screen width
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  videoContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: "100%",
    height: screenWidth * 0.5, // 50% of screen width
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  placeholderText: {
    fontSize: screenWidth * 0.04, // 4% of screen width
    color: "#666",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  metaText: {
    fontSize: screenWidth * 0.04, // 4% of screen width
    color: "#666",
  },
  priceText: {
    fontSize: screenWidth * 0.06,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
    backgroundColor: "#000",
  },
  bottomButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: screenWidth * 0.04, // 4% of screen width
  },
  continueButton: {
    backgroundColor: "#32CD32",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: screenWidth * 0.04,
    color: "#666",
  },
  errorText: {
    fontSize: screenWidth * 0.04,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: screenWidth * 0.04,
  },
  sectionHeading: {
    fontSize: screenWidth * 0.05,
    fontWeight: "800",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  sectionText: {
    fontSize: screenWidth * 0.035,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
  },
});

export default WorkshopDetails;
