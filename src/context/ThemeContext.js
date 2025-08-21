import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColors } from "../assets/colors";

const ThemeContext = createContext();
const STORAGE_KEY = "APP_THEME_SCHEME";

export const ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState("light");

    // Load theme from AsyncStorage
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedScheme = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedScheme) {
                    setColorScheme(savedScheme);
                }
            } catch (error) {
                console.error("Error loading theme:", error);
            }
        };
        loadTheme();
    }, []);

    // Save theme to AsyncStorage on change
    useEffect(() => {
        const saveTheme = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, colorScheme);
            } catch (error) {
                console.error("Error saving theme:", error);
            }
        };
        saveTheme();
    }, [colorScheme]);

    const currentColors = getColors(colorScheme);

    const theme = {
        colors: currentColors,
        colorScheme,
        setScheme: setColorScheme,
    };

    return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
