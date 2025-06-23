import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../constants";
import axios from "axios";
import { Toast } from "toastify-react-native";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const fetchUserDetails = async (accessToken) => {
        try {
            const response = await axios.get(`${API.BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            if (response.data) {
                return response.data.user;
            } else {
                console.error('Failed to fetch user details:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    const login = async (data) => {
        try {
            const loginTime = new Date().toISOString();

            // Fetch user details using the access token
            const userDetails = await fetchUserDetails(data.access_token);

            if (userDetails) {
                // Store token, user details, and login time
                await AsyncStorage.multiSet([
                    ['access_token', data.access_token],
                    ['email', userDetails.email],
                    ['full_name', userDetails.full_name],
                    ['mobile_number', userDetails.mobile_number || ''],
                    ['login_time', loginTime]
                ]);

                setToken(data.access_token);
                setUser({
                    email: userDetails.email,
                    full_name: userDetails.full_name,
                    mobile_number: userDetails.mobile_number,
                    role: userDetails.role
                });
                setIsAuthenticated(true);
            } else {
                // If user details fetch fails, still store the token but with limited info
                await AsyncStorage.multiSet([
                    ['access_token', data.access_token],
                    ['login_time', loginTime]
                ]);

                setToken(data.access_token);
                setUser(null);
                setIsAuthenticated(true);
                console.warn('Login successful but failed to fetch user details');
            }
        } catch (error) {
            console.error("Login storage error:", error);
        }
    };


    const logoutCookie = async () => {
        try {
            const response = await axios.get(`${API.BASE_URL}/users/logout`);
        } catch (error) {
            console.log("error: ", error)
            throw error;
        }
    };


    const logout = async () => {
        try {
            await logoutCookie()
            await AsyncStorage.clear();
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            Toast.error(
                "Failed to logout. Please try again later.",
            )
            console.error("Logout clear error:", error);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("access_token");
            const email = await AsyncStorage.getItem("email");
            const full_name = await AsyncStorage.getItem("full_name");
            const mobile_number = await AsyncStorage.getItem("mobile_number");

            if (storedToken) {
                setToken(storedToken);

                // If we have stored user details, use them
                if (email && full_name) {
                    setUser({
                        email,
                        full_name,
                        mobile_number
                    });
                } else {
                    // If no stored user details, fetch them from API
                    const userDetails = await fetchUserDetails(storedToken);
                    if (userDetails) {
                        // Update AsyncStorage with fetched details
                        await AsyncStorage.multiSet([
                            ['email', userDetails.email],
                            ['full_name', userDetails.full_name],
                            ['mobile_number', userDetails.mobile_number || '']
                        ]);

                        setUser({
                            email: userDetails.email,
                            full_name: userDetails.full_name,
                            mobile_number: userDetails.mobile_number,
                            role: userDetails.role
                        });
                    }
                }

                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                user,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};