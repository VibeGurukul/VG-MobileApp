import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState, useMemo } from "react";
import { colors } from "../../assets/colors";
import Header from "../../components/Header";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Typography from "../../library/components/Typography";
import { useAuth } from "../../context/AuthContext";
import { removeFromCartAsync } from "../../store/slices/cart-slice";
import CartItem from "./components/CartItem";
import EmptyComponent from "../../components/EmptyComponent";

const Cart = ({ navigation }) => {
  const cartState = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  const { width: screenWidth } = Dimensions.get("window");
  const isTablet = screenWidth > 768;

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return cartState.cart.reduce((sum, item) => sum + parseInt(item.price), 0);
  }, [cartState.cart]);

  const renderItem = ({ item }) => {
    return <CartItem item={item} />;
  };

  const Footer = () => (
    <View style={styles.footer}>
      <View style={styles.totalContainer}>
        <Typography style={styles.orderTotalLabel}>Order Total:</Typography>
        <Typography style={styles.orderTotalAmount}>
          ₹ {totalAmount}/-
        </Typography>
      </View>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => {
          // Handle payment navigation
          console.log("Navigate to payment");
        }}
      >
        <Typography style={styles.paymentButtonText}>
          Continue to Payment
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`Namaste ${user.full_name.split(" ")[0] || "Guest"}!`}
        subtitle={"Cart"}
        onBack={() => navigation.goBack()}
      />
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 24 }}>
        <TextInput
          style={[styles.searchBar, isTablet && styles.tabletSearchBar]}
          placeholder="Search something..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={cartState.cart}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.course_id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={() => <EmptyComponent />}
        />
      </View>
      {cartState.cart.length > 0 && <Footer />}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBar: {
    backgroundColor: "white",
    marginHorizontal: 6,
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: "center",
    width: "100%",
  },
  tabletSearchBar: {
    fontSize: 20,
    padding: 18,
    width: "80%",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  footer: {
    backgroundColor: "#FF9500", // Orange color matching the screenshot
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  orderTotalLabel: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "500",
    marginBottom: 4,
  },
  orderTotalAmount: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "bold",
  },
  paymentButton: {
    backgroundColor: colors.black,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  paymentButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
  },
});
