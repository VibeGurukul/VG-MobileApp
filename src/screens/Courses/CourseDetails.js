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
import Header from '../../components/Header';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseDetails = ({ route, navigation }) => {
  const { course } = route.params;
  const [activeTab, setActiveTab] = useState('Description');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem('full_name');
        if (storedFullName) {
          const firstName = storedFullName.split(' ')[0]; // Extract first name
          setFirstName(firstName);
        }
      } catch (error) {
        console.error('Error retrieving name from AsyncStorage:', error);
      }
    };

    fetchUserName();
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

        {/* Tabs Section */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={activeTab === 'Description' ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab('Description')}
          >
            <Text style={activeTab === 'Description' ? styles.activeTabText : styles.inactiveTabText}>
              Description
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={activeTab === 'Playlist' ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab('Playlist')}
          >
            <Text style={activeTab === 'Playlist' ? styles.activeTabText : styles.inactiveTabText}>
              Playlist
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Card */}
        <View style={styles.card}>
          {/* Course Description Card */}
          {activeTab === 'Description' && (
            <>
              <Text style={styles.sectionHeading}>Description</Text>
              <Text style={styles.sectionText}>{course.description}</Text>

              <Text style={styles.sectionHeading}>Learnings</Text>
              <Text style={styles.sectionText}>{course.learnings}</Text>

              <Text style={styles.sectionHeading}>USP</Text>
              <Text style={styles.sectionText}>{course.usp}</Text>
            </>
          )}
          
          {/* Course Playlist Card */}
          {activeTab === 'Playlist' && (
            <View style={styles.playlistContainer}>
              {course.sections.map((section, index) => (
                <View key={index} style={styles.episodeCard}>
                  <View style={styles.iconContainer}>
                    <Icon name="lock" size={16} color="#fff" />
                  </View>
                  <Text style={styles.episodeText}>{section.heading}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon name="bookmark" size={24} color="#FF6F60" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginVertical: 10,
    padding: 5,
  },
  activeTab: {
    backgroundColor: '#FFA500',
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
    color: '#FFF',
    fontSize: screenWidth * 0.04, // 4% of screen width
  },
  inactiveTabText: {
    color: '#1c1c1c',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04, // 4% of screen width
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
    fontSize: screenWidth * 0.05, // 5% of screen width
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
  episodeText: {
    fontSize: screenWidth * 0.035, // 3.5% of screen width
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  enrollButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  enrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04, // 4% of screen width
  },
});

export default CourseDetails;