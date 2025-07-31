import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import HomeWhySection from '../../components/HomeWhySection';
import Typography from '../../library/components/Typography';
import { useDispatch } from 'react-redux';
import { fetchCartData } from '../../store/slices/cart-slice';

const HomeScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartData());

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
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title={`Namaste!`}
        subtitle="Continue your journey into the unknowns of Sanatan with us."
      />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search something..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Cards */}
        <View
          style={[styles.cardContainer, isTablet && styles.tabletCardContainer]}
        >
          {/* Course Card */}
          <View style={[styles.section, isTablet && styles.tabletSection]}>
            <Typography style={styles.sectionTitle}>
              Explore our courses
            </Typography>
            <View style={[styles.card, isTablet && styles.tabletCard]}>
              <Image
                source={require('../../assets/BloomingBuds.webp')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('AllCourses')}
              >
                <Typography style={styles.ctaButtonText}>Explore</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Workshop Card */}
          <View style={[styles.section, isTablet && styles.tabletSection]}>
            <Typography style={styles.sectionTitle}>
              Take part in our Workshops
            </Typography>
            <View style={[styles.card, isTablet && styles.tabletCard]}>
              <Image
                source={require('../../assets/BloomingBuds.webp')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.ctaButton}>
                <Typography style={styles.ctaButtonText}>Join</Typography>
              </TouchableOpacity>
            </View>
          </View>

          <HomeWhySection />
        </View>
        <View style={{ height: 95 }} />
      </ScrollView>
    </SafeAreaView>
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
  searchContainer: {
    marginBottom: 30,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContainer: {
    gap: 10,
    paddingHorizontal: 10,
  },
  tabletCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  section: {
    marginBottom: 30,
  },
  tabletSection: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    height: 175,
  },
  tabletCard: {
    height: 200,
    width: '100%',
  },
  cardImage: {
    height: '80%',
    width: '80%',
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  ctaButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    position: 'absolute',
    bottom: '40%',
    right: '10%',
    transform: [{ translateX: 15 }],
  },
  ctaButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
