import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Header from '../../components/Header';
import CourseTabs from '../../components/CourseTabs';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseDetails = ({ route, navigation }) => {
  const { course } = route.params;
  const [firstName, setFirstName] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem("full_name");
        const storedEmail = await AsyncStorage.getItem("email");
        const storedToken = await AsyncStorage.getItem("access_token");

        if (storedFullName) {
          const firstName = storedFullName.split(" ")[0]; // Extract first name
          setFirstName(firstName);
        }

        if (storedEmail && storedToken) {
          setEmail(storedEmail);
          setToken(storedToken);

          // Call checkEnrollmentStatus after setting email & token
          checkEnrollmentStatus(storedEmail, storedToken);
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    const checkEnrollmentStatus = async (userEmail, userToken) => {
      if (!userToken) return; // Ensure token is available before making the request

      try {
        const response = await axios.get(
          "https://dev.vibegurukul.in/api/v1/check-enroll",
          {
            params: { user_email: userEmail, course_id: course._id },
          }
        );

        if (response.data.isEnrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Header title={`Namaste ${firstName || 'Guest'}!`} subtitle="Course Details" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Course Title */}
        <Text style={styles.courseTitle}>{course.title}</Text>

        {/* Preview Video Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>Video Preview</Text>
          </View>
        </View>

        {/* Rating and Duration */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>⭐ 4.5 Rating</Text>
          <Text style={styles.metaText}>⏳ 8 Hours Duration</Text>
        </View>

        {/* Price */}
        <Text style={styles.priceText}>₹{course.price}/-</Text>

        <CourseTabs course={course} isEnrolled={isEnrolled} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon name="bookmark" size={24} color="#FF6F60" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.bottomButton,
          isEnrolled ? styles.continueButton : styles.enrollButton,
        ]}
        >
          <Text style={styles.bottomButtonText}>{isEnrolled ? "Continue" : "Enroll Now"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: screenWidth * 0.06, // 6% of screen width
    fontWeight: 'bold',
    color: '#FF6F60',
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
});

export default CourseDetails;