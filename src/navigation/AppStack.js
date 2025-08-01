import { createStackNavigator } from "@react-navigation/stack";
import CourseDetails from "../screens/Courses/CourseDetails";
import MainVideoScreen from "../screens/MainVideo";
import Cart from "../screens/Cart";
import BottomTabNavigator from "../components/BottomNavigation";
import WorkshopDetails from "../screens/workshop/WorkshopDetails";
import CheckoutScreen from "../screens/Payment/CheckoutPage";
import UpdateMobile from "../screens/UpdateScreen/UpdateMobile";
import UpdatePassword from "../screens/UpdateScreen/UpdatePassword";
import ZoomVideoCall from "../screens/ZoomCall";

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyTabs" component={BottomTabNavigator} />
            <Stack.Screen name="CourseDetails" component={CourseDetails} />
            <Stack.Screen name="MainVideoScreen" component={MainVideoScreen} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="WorkshopDetails" component={WorkshopDetails} />
            <Stack.Screen name="UpdateMobile" component={UpdateMobile} />
            <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
            <Stack.Screen name="ZoomSdk" component={ZoomVideoCall} />
        </Stack.Navigator>
    );
}
