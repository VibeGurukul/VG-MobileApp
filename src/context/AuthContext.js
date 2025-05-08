import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const login = async (data) => {
        try {
            const loginTime = new Date().toISOString();
            await AsyncStorage.multiSet([
                ['access_token', data.access_token],
                ['email', data.email],
                ['full_name', data.full_name],
                ['login_time', loginTime]
            ]);

            setToken(data.access_token);
            setUser({ email: data.email, full_name: data.full_name });
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login storage error:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error("Logout clear error:", error);
        } finally {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("access_token");
            const email = await AsyncStorage.getItem("email");
            const full_name = await AsyncStorage.getItem("full_name");

            if (storedToken) {
                setToken(storedToken);
                setUser({ email, full_name });
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
