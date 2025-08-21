import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import InfoModal from '../../components/Modal/InfoModal';
import { useRoute } from '@react-navigation/native';
import { API } from '../../constants';
import Typography from '../../library/components/Typography';
import { useTheme } from '../../context/ThemeContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const route = useRoute();
  const { email } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      paddingTop: 50,
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      padding: 20,
      width: '100%',
      height: '100%',
      marginTop: 20,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      marginTop: 50,
      marginBottom: 20,
      textAlign: 'center',
      color: colors.textPrimary,
    },
    secondaryText: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.textSecondary,
      fontWeight: '400',
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    input: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 10,
      marginBottom: 20,
      color: colors.textPrimary,
      backgroundColor: colors.cardBackground,
    },
    button: {
      width: '100%',
      padding: 15,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      marginBottom: 20,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      alignItems: 'center',
      padding: 10,
      marginBottom: 30,
    },
    backButtonText: {
      color: colors.link,
      fontSize: 16,
      fontWeight: '500',
    },
    disabledInput: {
      backgroundColor: colors.disabledBackground,
    },
  });

  const handleSubmit = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API.BASE_URL}/forgot-password`, {
        email: email,
      });

      if (response.data) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Forgot Password Error:', error?.response?.data);

      if (error.response) {
        setErrorMessage(
          error?.response?.data?.detail ||
            'Failed to process your request. Please try again.',
        );
      } else {
        setErrorMessage(
          'Network error. Please check your connection and try again.',
        );
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Typography style={styles.title}>Forgot Password</Typography>
          <Typography style={styles.secondaryText}>
            Enter your email address and we'll send you instructions to reset
            your password
          </Typography>

          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Email address"
            placeholderTextColor={colors.textQuaternary}
            value={email}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.button,
              (!email || isLoading) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!email || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Typography style={styles.buttonText}>Send Reset Link</Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Typography style={styles.backButtonText}>Back to Login</Typography>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <InfoModal
        title={'Link Sent Successfully!'}
        description={
          'A reset password link has been sent to your email address. Please check your email and follow the instructions to reset your password.'
        }
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
