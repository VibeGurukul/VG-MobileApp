import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import BottomNavBar from '../../components/BottomNavBar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../assets/colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const { logout } = useAuth()

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem('full_name');
        if (storedFullName) {
          const firstName = storedFullName.split(' ')[0];
          setFirstName(firstName);
        }
      } catch (error) {
        console.error('Error retrieving name from AsyncStorage:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* Greeting Section */}
      <Header
        title={`Namaste ${firstName || 'Guest'}!`}
        subtitle="Continue your journey into the unknowns of Sanatan with us."
      />
      <View style={styles.content} >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search something..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Update Buttons */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Mobile</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>


      </View>
      {/* Bottom Navigation */}
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 20,
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
  button: {
    backgroundColor: 'linear-gradient(90deg, #FFD700, #FFA500)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: colors.error,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  signOutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default ProfileScreen;
