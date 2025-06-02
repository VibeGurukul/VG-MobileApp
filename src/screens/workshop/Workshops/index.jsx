import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import { colors } from "../../../assets/colors";
import { API } from "../../../constants";

const Workshops = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workshops, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");

  const { width: screenWidth } = Dimensions.get("window");
  const isTablet = screenWidth > 768;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API.BASE_URL}/workshops`);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError("Failed to load workshops. Please try again later.");
        setLoading(false);
      }
    };

    const fetchUserName = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem("full_name");
        if (storedFullName) {
          const firstName = storedFullName.split(" ")[0]; // Extract first name
          setFirstName(firstName);
        }
      } catch (error) {
        console.error("Error retrieving name from AsyncStorage:", error);
      }
    };

    fetchCourses();
    fetchUserName();
  }, []);

  // Filter workshops based on search query
  const filteredCourses = workshops.filter((workshop) =>
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Namaste!`}
        subtitle="All Workshops"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && styles.tabletContent,
        ]}
      >
        <TextInput
          style={[styles.searchBar, isTablet && styles.tabletSearchBar]}
          placeholder="Search something..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View
          style={[
            styles.workshopsContainer,
            isTablet && styles.tabletCoursesContainer,
          ]}
        >
          {filteredCourses.map((workshop) => (
            <View
              key={workshop._id}
              style={[styles.workshopCard, isTablet && styles.tabletCourseCard]}
            >
              <Image
                source={{ uri: workshop.preview_image }}
                style={{
                  width: isTablet ? screenWidth * 0.4 : screenWidth * 0.8, // Adjust for tablet
                  height: isTablet ? screenWidth * 0.4 : screenWidth * 0.8, // Adjust height proportionally
                  borderRadius: 25,
                  alignSelf: "center",
                  marginTop: screenWidth * 0.05,
                  resizeMode: "cover",
                }}
                resizeMode="cover"
              />

              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.workshopTitle,
                    isTablet && styles.tabletCourseTitle,
                  ]}
                >
                  {workshop.title}
                </Text>

                <View style={styles.priceAndButtonContainer}>
                  <View style={styles.priceContainer}>
                    <Text
                      style={[
                        styles.currentPrice,
                        isTablet && styles.tabletCurrentPrice,
                      ]}
                    >
                      ₹{workshop.price}
                    </Text>
                    {workshop.original_price &&
                      workshop.original_price !== workshop.price && (
                        <Text
                          style={[
                            styles.originalPrice,
                            isTablet && styles.tabletOriginalPrice,
                          ]}
                        >
                          ₹{workshop.original_price}
                        </Text>
                      )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.viewButton,
                      isTablet && styles.tabletViewButton,
                    ]}
                    onPress={() =>
                      navigation.navigate("WorkshopDetails", {
                        workshop,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 95 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  tabletContent: {
    padding: 40,
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: "center",
    width: "100%",
  },
  tabletSearchBar: {
    fontSize: 20,
    padding: 18,
    width: "80%",
  },
  workshopsContainer: {
    gap: 20,
  },
  tabletCoursesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workshopCard: {
    backgroundColor: "white",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: "100%",
  },
  tabletCourseCard: {
    width: "48%", // Display two workshops side by side on tablets
  },
  cardContent: {
    padding: 15,
  },
  workshopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  tabletCourseTitle: {
    fontSize: 22,
  },
  priceAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 10,
  },
  tabletCurrentPrice: {
    fontSize: 18,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  tabletOriginalPrice: {
    fontSize: 16,
  },
  viewButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  tabletViewButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.primary,
  },
});

export default Workshops;
