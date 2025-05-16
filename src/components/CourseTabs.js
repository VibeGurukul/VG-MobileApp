import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "toastify-react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseTabs = ({ course, isEnrolled, player }) => {
  const [activeTab, setActiveTab] = useState("Description");
  const navigation = useNavigation()

  const handleCourseClick = (section) => {
    if (isEnrolled) {
      player.pause()
      navigation.navigate("MainVideoScreen", {
        videoURL: section.videos[0]?.url, videoTitle: section.videos[0]?.title, courseId: course._id, chapterId: section.id
      })
    } else {
      Toast.error("You are not enrolled in this course")
    }
  }

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={activeTab === "Description" ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab("Description")}
        >
          <Text
            style={activeTab === "Description" ? styles.activeTabText : styles.inactiveTabText}
          >
            Description
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={activeTab === "Playlist" ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab("Playlist")}
        >
          <Text style={activeTab === "Playlist" ? styles.activeTabText : styles.inactiveTabText}>
            Playlist
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        {activeTab === "Description" ? (
          <>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.sectionText}>{course.description}</Text>

            <Text style={styles.sectionHeading}>Learnings</Text>
            <Text style={styles.sectionText}>{course.learnings}</Text>

            <Text style={styles.sectionHeading}>USP</Text>
            <Text style={styles.sectionText}>{course.usp}</Text>
          </>
        ) : (
          <View style={styles.playlistContainer}>
            {course.sections.map((section, index) => (
              <TouchableOpacity
                // onPress={() => console.log("section: ", section.id)}
                onPress={() => handleCourseClick(section)}
                key={index}
                style={[styles.episodeCard]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isEnrolled ? styles.iconContainerEnrolled : styles.iconContainerLocked,
                  ]}
                >
                  <Icon name={isEnrolled ? "play" : "lock"} size={16} color="#fff" />
                </View>
                <Text
                  style={[styles.episodeText]}
                >
                  {section.heading}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginVertical: 10,
    padding: 5,
  },
  activeTab: {
    backgroundColor: colors.secondary,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderRadius: 25,
  },
  inactiveTab: {
    backgroundColor: '#fff',
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: colors.white,
    fontSize: screenWidth * 0.04,
  },
  inactiveTabText: {
    color: '#1c1c1c',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionHeading: {
    fontSize: screenWidth * 0.05,
    fontWeight: '800',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: screenWidth * 0.035, // 3.5% of screen width
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconContainerEnrolled: {
    backgroundColor: "#32CD32",
  },
  episodeText: {
    fontSize: screenWidth * 0.035, // 3.5% of screen width
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
});

export default CourseTabs;
