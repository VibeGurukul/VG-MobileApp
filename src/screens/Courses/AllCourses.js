import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';

const AllCourses = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { width: screenWidth } = Dimensions.get('window');

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

    fetchCourses();
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
        title="Namaste Kushagra!"
        subtitle="All Courses"
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search something..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.coursesContainer}>
          {filteredCourses.map(course => (
            <View key={course._id} style={styles.courseCard}>
              <Image
                source={{ uri: course.preview_image }}
                style={styles.courseImage}
                resizeMode="cover"
              />
              
              <View style={styles.cardContent}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                    <View style={styles.priceAndButtonContainer}>
                        <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>₹{course.price}</Text>
                        {course.original_price && course.original_price !== course.price && (
                            <Text style={styles.originalPrice}>₹{course.original_price}</Text>
                        )}
                        </View>
                        
                        <TouchableOpacity
                        style={styles.viewButton}
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
  coursesContainer: {
    gap: 20,
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
    width: '100%'
  },
  courseImage: {
    width: 300,
    height: 300,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    resizeMode: 'cover'
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
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  viewButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: 'flex-end',
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