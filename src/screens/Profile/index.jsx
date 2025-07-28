import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../assets/colors';

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const { logout, user } = useAuth();

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
      <Header title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient Background */}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Text style={styles.profileInitials}>
                {getInitials(user?.full_name)}
              </Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>

          <Text style={styles.userName}>{user?.full_name || 'User Name'}</Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>

          {/* Stats Row */}
          {/* <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}></Text>
              <Text style={styles.statLabel}></Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}></Text>
              <Text style={styles.statLabel}></Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}></Text>
              <Text style={styles.statLabel}></Text>
            </View>
          </View> */}
        </View>

        {/* User Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.iconText}>👤</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>
                  {user?.full_name || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.iconText}>📧</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>
                  {user?.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.iconText}>📱</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Mobile Number</Text>
                <Text style={styles.infoValue}>
                  {user?.mobile_number || 'Not provided'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('UpdatePassword')}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>🔐</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Update Password</Text>
                <Text style={styles.actionSubtitle}>
                  Change your account password
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateMobile')}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📱</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Update Mobile</Text>
                <Text style={styles.actionSubtitle}>
                  Change your mobile number
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    marginBottom: 20,
  },
  gradientHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  namaste: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 22,
  },
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
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
    borderColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    borderColor: colors.white,
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
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    opacity: 0.3,
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
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
    backgroundColor: colors.primary + '15',
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
    opacity: 0.1,
    marginLeft: 55,
  },
  searchSection: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.textPrimary,
  },
  actionsSection: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
    backgroundColor: colors.secondary + '15',
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
    backgroundColor: colors.primary,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  signOutIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  signOutText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ProfileScreen;
