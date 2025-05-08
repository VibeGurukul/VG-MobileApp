import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import InfoModal from '../components/Modal/InfoModal';
import { colors } from '../assets/colors';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            setErrorMessage('Please enter your email address');
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('https://dev.vibegurukul.in/api/v1/forgot-password', {
                email: email
            });

            if (response.data) {
                setModalVisible(true); // Show modal on success
            }
        } catch (error) {
            console.error("Forgot Password Error:", error?.response?.data?.detail);

            if (error.response) {
                setErrorMessage(JSON.stringify(error?.response?.data?.detail) || 'Failed to process your request. Please try again.');
            } else {
                setErrorMessage('Network error. Please check your connection and try again.');
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <View style={styles.card}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.secondaryText}>
                        Enter your email address and we'll send you instructions to reset
                        your password
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[styles.button, (!email || isLoading) && { opacity: 0.5 }]}
                        onPress={handleSubmit}
                        disabled={!email || isLoading}
                    >
                        {
                            isLoading ? <ActivityIndicator color="#fff" size="small" /> :
                                <Text style={styles.buttonText}>
                                    Send Reset Link
                                </Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Back to Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <InfoModal
                title={"Link Sent Successfully!"}
                description={
                    "A reset password link has been sent to your email address. Please check your email and follow the instructions to reset your password."
                }
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

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
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    secondaryText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#1c1c1c',
        fontWeight: '400',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        alignItems: 'center',
        padding: 10,
        marginBottom: 30,
    },
    backButtonText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: '500',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;