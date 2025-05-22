import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import AllCourses from "../screens/Courses/AllCourses";
import CourseDetails from "../screens/Courses/CourseDetails";
import MainVideoScreen from "../screens/MainVideo";
import MyZone from "../screens/MyZone";

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="AllCourses" component={AllCourses} />
            <Stack.Screen name="CourseDetails" component={CourseDetails} />
            <Stack.Screen name="MainVideoScreen" component={MainVideoScreen} />
            <Stack.Screen name="MyZone" component={MyZone} />
        </Stack.Navigator>
    );
}
