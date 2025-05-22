import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BookmarkCard from "./components/BookMarkCard";
import { useDispatch, useSelector } from "react-redux";
import { removeBookmark } from "../../store/slices/bookmarkSlice";
import Header from "../../components/Header";
import { colors } from "../../assets/colors";
import EmptyComponent from "../../components/EmptyComponent";
import BottomNavBar from "../../components/BottomNavBar";
import { useEffect, useState } from "react";
import { API } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { backgroundColors, iconColors } from "./utils";

const CourseCard = ({ course, index }) => {
  const randomBgColor = backgroundColors[index % backgroundColors.length];
  const randomIconColor = iconColors[index % iconColors.length];

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: randomBgColor }]}>
      <View
        style={[styles.iconContainer, { backgroundColor: randomIconColor }]}
      >
        <Ionicons name={course.icon || "play"} size={24} color="white" />
      </View>
      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.cardSubtitle}>
        {course.course_progress || course.progress || 0}% completed
      </Text>
    </TouchableOpacity>
  );
};

const WorkshopCard = ({ workshop }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: workshop.bgColor }]}
  >
    <View style={[styles.iconContainer, { backgroundColor: workshop.color }]}>
      <Ionicons name={workshop.icon} size={24} color="white" />
    </View>
    <Text style={styles.cardTitle}>{workshop.title}</Text>
    <Text style={styles.cardSubtitle}>{workshop.date}</Text>
  </TouchableOpacity>
);

export default function LearningDashboard({ navigation }) {
  const state = useSelector((state) => state.bookmark);
  const dispatch = useDispatch();
  const { token } = useAuth();

  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const removeBookMark = (id) => {
    dispatch(removeBookmark(id));
  };
  const { bookmarked } = state;

  const getMyCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API.BASE_URL}/users/me/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyCourses(response.data);
    } catch (error) {
      console.log("the error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"My Zone"} onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses enrolled in</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={colors.primary || "#FF6B6B"}
              />
              <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
          ) : (
            <View style={styles.cardRow}>
              {myCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
              {myCourses.length === 0 && <EmptyComponent />}
            </View>
          )}
        </View>

        {/* Workshops Section */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming workshops</Text>
          <View style={styles.cardRow}>
            {workshopsData.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </View>
        </View> */}

        {/* Bookmarks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookmarks</Text>
          {bookmarked.map((bookmark) => (
            <BookmarkCard
              onPress={() =>
                navigation.navigate("CourseDetails", { course: bookmark })
              }
              key={bookmark?._id}
              item={bookmark}
              removeBookMark={() => removeBookMark(bookmark?._id)}
            />
          ))}
          {!bookmarked.length && <EmptyComponent />}
        </View>
        <View style={{ height: 90 }}></View>
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  header: {
    height: 60,
    backgroundColor: "#FF6B6B",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    width: "100%",
  },
  card: {
    flexBasis: "48%", // Changed from flex: 1 and width: "50%"
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    width: "100%",
    paddingVertical: 20,
  },
  bookmarkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  bookmarkIcon: {
    width: 16,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  bookmarkTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
