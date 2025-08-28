import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import PasswordInput from '../../components/PasswordInput';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../constants';
import Typography from '../../library/components/Typography';
import { useTheme } from '../../context/ThemeContext';
import { showError, showWarning } from '../../services/ToastService';

const RegisterScreen = () => {
  const route = useRoute();
  const { colors } = useTheme();

  const { email } = route.params || {};
  const navigation = useNavigation();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      marginBottom: 30,
      textAlign: 'center',
      color: colors.textPrimary,
    },
    secondaryText: {
      fontSize: 20,
      textAlign: 'center',
      color: colors.textSecondary,
      fontWeight: '400',
      marginBottom: 30,
    },
    input: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 10,
      marginBottom: 15,
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
      marginBottom: 15,
    },
    buttonDisabled: {
      backgroundColor: colors.disabled,
      opacity: 0.7,
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.cardBorder,
    },
    dividerText: {
      marginHorizontal: 10,
      color: colors.textTertiary,
      fontSize: 14,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    socialButton: {
      marginHorizontal: 10,
    },
  });

  const handleSubmit = async () => {
    if (!fullName || !mobileNumber || !password) {
      showWarning('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API.BASE_URL}/register/`,
        {
          email: email,
          password: password,
          full_name: fullName,
          mobile_number: mobileNumber,
        },
        {
          headers: {
            'X-Client-Type': 'mobile',
          },
        },
      );

      if (response.data.token_type === 'bearer') {
        await login(response.data);
      } else {
        setErrorMessage('Failed to create account. Please try again later.');
        showWarning(errorMessage);
      }
    } catch (error) {
      console.error(
        'Registration Error:',
        error?.response?.data || error?.message || error,
      );

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            'Registration failed. Please check your credentials.',
        );
      } else {
        setErrorMessage('Network error. Please try again.');
      }
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      <ScrollView style={styles.card}>
        <Typography style={styles.title}>Welcome To Vibe Gurukul</Typography>
        <Typography style={styles.secondaryText}>Hey There, 👋</Typography>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={colors.textQuaternary}
          value={email}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={colors.textQuaternary}
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor={colors.textQuaternary}
          value={mobileNumber}
          onChangeText={text => {
            const numericValue = text.replace(/[^0-9]/g, '');
            setMobileNumber(numericValue);
          }}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <PasswordInput
          password={password}
          style={styles.input}
          setPassword={setPassword}
          placeholderTextColor={colors.textQuaternary}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !fullName || !mobileNumber || !password}
        >
          {isLoading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Typography style={styles.buttonText}>Create an account</Typography>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Typography style={styles.dividerText}>OR</Typography>
          <View style={styles.dividerLine} />
        </View>

        <Typography style={styles.secondaryText}>Sign In With</Typography>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Icon name="facebook" size={24} color={colors.facebook} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
