import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../assets/colors';

const BottomNavBar = ({ navigation, currentScreen }) => {
  const navItems = [
    {
      name: 'Home',
      icon: 'home',
      navigateTo: 'HomeScreen'
    },
    {
      name: 'Courses',
      icon: 'book',
      navigateTo: 'AllCourses'
    },
    {
      name: 'Workshops',
      icon: 'users',
      navigateTo: 'HomeScreen'
    },
    {
      name: 'My Zone',
      icon: 'graduation-cap',
      navigateTo: 'HomeScreen'
    },
    {
      name: 'Profile',
      icon: 'user',
      navigateTo: 'ProfileScreen'
    }
  ];

  return (
    <View style={styles.navContainer}>
      {navItems.map((item, index) => {
        const isActive = currentScreen === item.navigateTo;
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.navigateTo)}
          >
            <Icon
              name={item.icon}
              size={22}
              color={isActive ? colors.background : 'rgba(255, 255, 255, 0.8)'}
            />
            <Text style={[
              styles.navText,
              isActive && styles.activeNavText
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    height: 81,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  navText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 5,
  },
  activeNavText: {
    color: colors.background,
    fontWeight: '700',
  },
});

export default BottomNavBar;