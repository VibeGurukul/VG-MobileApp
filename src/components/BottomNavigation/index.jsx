import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../assets/colors";
import HomeScreen from "../../screens/HomeScreen";
import AllCourses from "../../screens/Courses/AllCourses";
import LearningDashboard from "../../screens/MyZone";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import Workshops from "../../screens/workshop/Workshops";

const Tab = createBottomTabNavigator();

// Custom Tab Icon Component with circular background for active state
const CustomTabIcon = ({ focused, iconName, color, size }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: focused ? "rgba(255, 231, 96, 0.8)" : "transparent", // Light yellow background when focused
      }}
    >
      <Icon
        name={iconName}
        size={size}
        color={focused ? colors.secondary : color} // Change icon color when focused for better contrast
      />
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "AllCourses":
              iconName = "book";
              break;
            case "Workshops":
              iconName = "users";
              break;
            case "MyZone":
              iconName = "graduation-cap";
              break;
            case "Profile":
              iconName = "user";
              break;
            default:
              iconName = "home";
          }

          return (
            <CustomTabIcon
              focused={focused}
              iconName={iconName}
              color={color}
              size={22}
            />
          );
        },
        tabBarActiveTintColor: "rgba(255, 255, 255, 0.8)",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.8)",
        tabBarStyle: {
          backgroundColor: colors.secondary,
          height: 90,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderTopWidth: 0,
          paddingBottom: 20,
          paddingTop: 10,
          position: "absolute",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="AllCourses"
        component={AllCourses}
        options={{
          tabBarLabel: "Courses",
        }}
      />
      <Tab.Screen
        name="Workshops"
        component={Workshops}
        options={{
          tabBarLabel: "Workshops",
        }}
      />
      <Tab.Screen
        name="MyZone"
        component={LearningDashboard}
        options={{
          tabBarLabel: "My Zone",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
