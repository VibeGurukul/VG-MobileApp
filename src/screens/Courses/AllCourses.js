import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';

const AllCourses = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState('');

  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768; 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://dev.vibegurukul.in/api/v1/courses'); 
        setCourses(response.data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };
  
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

    fetchCourses();
    fetchUserName();
  }, []);
  

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F60" />
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
         title={`Namaste ${firstName || 'Guest'}!`}
        subtitle="All Courses"
      />
      
      <ScrollView contentContainerStyle={[styles.content, isTablet && styles.tabletContent]}>
        <TextInput
          style={[styles.searchBar, isTablet && styles.tabletSearchBar]}
          placeholder="Search something..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={[styles.coursesContainer, isTablet && styles.tabletCoursesContainer]}>
          {filteredCourses.map(course => (
            <View key={course._id} style={[styles.courseCard, isTablet && styles.tabletCourseCard]}>
              <Image
                source={{ uri: course.preview_image }}
                style={{
                  width: isTablet ? screenWidth * 0.4 : screenWidth * 0.8, // Adjust for tablet
                  height: isTablet ? screenWidth * 0.4 : screenWidth * 0.8, // Adjust height proportionally
                  borderRadius: 25,
                  alignSelf: 'center',
                  marginTop: screenWidth * 0.05,
                  resizeMode: 'cover'
                }}
                resizeMode="cover"
              />
              
              <View style={styles.cardContent}>
                <Text style={[styles.courseTitle, isTablet && styles.tabletCourseTitle]}>
                  {course.title}
                </Text>

                <View style={styles.priceAndButtonContainer}>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.currentPrice, isTablet && styles.tabletCurrentPrice]}>₹{course.price}</Text>
                    {course.original_price && course.original_price !== course.price && (
                      <Text style={[styles.originalPrice, isTablet && styles.tabletOriginalPrice]}>
                        ₹{course.original_price}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.viewButton, isTablet && styles.tabletViewButton]}
                    onPress={() => navigation.navigate('CourseDetails', { course })}
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  tabletContent: {
    padding: 40,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'center',
    width: '100%',
  },
  tabletSearchBar: {
    fontSize: 20,
    padding: 18,
    width: '80%',
  },
  coursesContainer: {
    gap: 20,
  },
  tabletCoursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: '100%',
  },
  tabletCourseCard: {
    width: '48%', // Display two courses side by side on tablets
  },
  cardContent: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
  },
  tabletCourseTitle: {
    fontSize: 22,
  },
  priceAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6F60',
    marginRight: 10
  },
  tabletCurrentPrice: {
    fontSize: 18,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  tabletOriginalPrice: {
    fontSize: 16,
  },
  viewButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  tabletViewButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6F60',
  },
});

export default AllCourses;
