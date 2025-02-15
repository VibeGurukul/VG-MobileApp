import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.navContainer}>
      {/* Home Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Courses Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.navText}>Courses</Text>
      </TouchableOpacity>

      {/* Workshops Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.navText}>Workshops</Text>
      </TouchableOpacity>

      {/* My Zone Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.navText}>My Zone</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileScreen')}>
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffa500',
    height: 81,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default BottomNavBar;