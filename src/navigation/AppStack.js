import { createStackNavigator } from "@react-navigation/stack";
import CourseDetails from "../screens/Courses/CourseDetails";
import MainVideoScreen from "../screens/MainVideo";
import Cart from "../screens/Cart";
import BottomTabNavigator from "../components/BottomNavBar";

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyTabs" component={BottomTabNavigator} />
            <Stack.Screen name="CourseDetails" component={CourseDetails} />
            <Stack.Screen name="MainVideoScreen" component={MainVideoScreen} />
            <Stack.Screen name="Cart" component={Cart} />
        </Stack.Navigator>
    );
}
