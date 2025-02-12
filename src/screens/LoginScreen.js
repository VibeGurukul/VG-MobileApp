import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PasswordInput from '../components/PasswordInput';


const LoginScreen = () => {
  const route = useRoute();
  const { email } = route.params || {};
  const navigation = useNavigation();
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://dev.vibegurukul.in/api/v1/login', {
        email: email,
        password: password
      }, {
        timeout: 100000  // 🔹 Set a timeout of 10 seconds
    });
      
      console.log("Response received:", response);
      if (response.data.access_token) {  
        console.log("Login Successful");
        const loginTime = new Date().toISOString(); // Store login timestamp
  
        // Store user details in AsyncStorage
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('email', response.data.email);
        await AsyncStorage.setItem('full_name', response.data.full_name);
        await AsyncStorage.setItem('login_time', loginTime);
  
        navigation.navigate('HomeScreen');
      } else {
        setErrorMessage('Failed to Login. Please try again with the correct password.');
      }
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error?.message || error);
  
      if (error.response) {
        setErrorMessage(error.response.data?.message || 'Login failed. Please check your credentials.');
      } else {
        setErrorMessage('Network error. Please try again.');
      }
    }
  };
  return (
    <View style={styles.container}>
      {/* Logo in the colored header area */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />

      {/* White Card Container */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome To Vibe Gurukul</Text>
        <Text style={styles.secondaryText}>Hi, Welcome Back 👋</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          editable={false}
        />

         {/* Password Input Component */}
        <PasswordInput password={password} setPassword={setPassword} />

        <TouchableOpacity 
            style={[styles.button, !password && { opacity: 0.5 }]} 
            onPress={password ? handleSubmit : null} 
            disabled={!password}
        >
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        <Text style={styles.secondaryText}>Sign In With</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          {/* Add other social icons */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6F60',
    alignItems: 'center',
    paddingTop: 40, // Space for logo at the top
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 50,
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
    color: '#000',
  },
  secondaryText:{
    fontSize: 20,
    textAlign: 'center',
    color: '#1c1c1c',
    fontWeight: 400,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFA500',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30
  },
  buttonText: {
    color: '#fff',
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
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
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

export default LoginScreen;