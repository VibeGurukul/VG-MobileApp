import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import Typography from '../../library/components/Typography';
import { useTheme } from '../../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const { logout, user } = useAuth();
  const { colors, setScheme, colorScheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileCard: {
      backgroundColor: colors.cardBackground,
      marginHorizontal: 20,
      marginTop: 10,
      borderRadius: 20,
      padding: 30,
      alignItems: 'center',
      boxShadow: `0 0 10px ${colors.white}`,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    profileImageWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: colors.cardBorder,
      boxShadow: `0 0 2px ${colors.black} inset`,
    },
    profileInitials: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.white,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.success,
      borderWidth: 3,
      borderColor: colors.cardBackground,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 5,
    },
    userEmail: {
      fontSize: 16,
      color: colors.textTertiary,
      marginBottom: 25,
    },
    infoSection: {
      marginHorizontal: 20,
      marginTop: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 15,
    },
    infoCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      padding: 20,
      boxShadow: `0 0 10px ${colors.white}`,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLighter,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    iconText: {
      fontSize: 18,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textTertiary,
      marginBottom: 3,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      opacity: 0.3,
      marginLeft: 55,
    },
    actionsSection: {
      marginHorizontal: 20,
      marginTop: 25,
    },
    actionButton: {
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      marginBottom: 10,
      boxShadow: `0 0 10px ${colors.white}`,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    actionButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    actionIcon: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      backgroundColor: colors.secondaryLighter,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    actionIconText: {
      fontSize: 20,
    },
    actionTextContainer: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 3,
    },
    actionSubtitle: {
      fontSize: 14,
      color: colors.textTertiary,
    },
    actionArrow: {
      fontSize: 18,
      color: colors.textTertiary,
      fontWeight: 'bold',
    },
    signOutSection: {
      marginHorizontal: 20,
      marginTop: 30,
    },
    signOutButton: {
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor: colors.error,
      boxShadow: `0 0 10px ${colors.white}`,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
    },
    signOutText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    bottomSpacing: {
      height: 100,
    },
  });

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
      await logout();
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Namaste!" subtitle={'Profile'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Typography style={styles.profileInitials}>
                {getInitials(user?.full_name)}
              </Typography>
            </View>
            <View style={styles.onlineIndicator} />
          </View>

          <Typography style={styles.userName}>
            {user?.full_name || 'User Name'}
          </Typography>
          <Typography style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Typography>
        </View>

        {/* Personal Info */}
        <View style={styles.infoSection}>
          <Typography style={styles.sectionTitle}>
            Personal Information
          </Typography>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Typography style={styles.iconText}>👤</Typography>
              </View>
              <View style={styles.infoContent}>
                <Typography style={styles.infoLabel}>Full Name</Typography>
                <Typography style={styles.infoValue}>
                  {user?.full_name || 'Not provided'}
                </Typography>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Typography style={styles.iconText}>📧</Typography>
              </View>
              <View style={styles.infoContent}>
                <Typography style={styles.infoLabel}>Email Address</Typography>
                <Typography style={styles.infoValue}>
                  {user?.email || 'Not provided'}
                </Typography>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Typography style={styles.iconText}>📱</Typography>
              </View>
              <View style={styles.infoContent}>
                <Typography style={styles.infoLabel}>Mobile Number</Typography>
                <Typography style={styles.infoValue}>
                  {user?.mobile_number || 'Not provided'}
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Typography style={styles.sectionTitle}>Account Settings</Typography>

          {/* 🌗 Change Theme Button */}
          <TouchableOpacity
            onPress={() => {
              setScheme(colorScheme === 'dark' ? 'light' : 'dark');
            }}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIcon}>
                <Typography style={styles.actionIconText}>
                  {colorScheme !== 'dark' ? '🌑' : '☀️'}
                </Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography style={styles.actionTitle}>
                  {colorScheme !== 'dark'
                    ? 'Switch To Dark Theme'
                    : 'Switch To Light Theme'}
                </Typography>
                <Typography style={styles.actionSubtitle}>
                  Switch between light and dark mode
                </Typography>
              </View>
              <Typography style={styles.actionArrow}>→</Typography>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('UpdatePassword')}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIcon}>
                <Typography style={styles.actionIconText}>🔐</Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography style={styles.actionTitle}>
                  Update Password
                </Typography>
                <Typography style={styles.actionSubtitle}>
                  Change your account password
                </Typography>
              </View>
              <Typography style={styles.actionArrow}>→</Typography>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateMobile')}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIcon}>
                <Typography style={styles.actionIconText}>📱</Typography>
              </View>
              <View style={styles.actionTextContainer}>
                <Typography style={styles.actionTitle}>
                  Update Mobile
                </Typography>
                <Typography style={styles.actionSubtitle}>
                  Change your mobile number
                </Typography>
              </View>
              <Typography style={styles.actionArrow}>→</Typography>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Typography style={styles.signOutText}>Sign Out</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
