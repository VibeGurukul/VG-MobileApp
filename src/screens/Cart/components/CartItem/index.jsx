import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../assets/colors";
import Typography from "../../../../library/components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCartAsync } from "../../../../store/slices/cart-slice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [removingFromCart, setRemoving] = useState(false);

  const handleRemoveFromCart = async (item) => {
    setRemoving(true);
    const removeData = {};
    if (item.course_id) removeData.course_id = item.course_id;
    if (item.workshop_id) removeData.workshop_id = item.workshop_id;

    try {
      await dispatch(removeFromCartAsync(removeData)).unwrap();
      console.log("Item removed from cart successfully");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.preview_image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Typography style={styles.title}>{item.short_title}</Typography>
        <View style={styles.priceContainer}>
          <View style={styles.priceContainerMain}>
            <Typography style={styles.price}>₹ {item.price}</Typography>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleRemoveFromCart(item)}
              style={styles.removeButton}
            >
              {removingFromCart ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Typography style={styles.removeText}>Remove</Typography>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.black,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  removeButton: {
    backgroundColor: colors.black,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  removeText: {
    fontSize: 13,
    color: colors.white,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 10,
  },
  priceContainerMain: {
    width: "30%",
  },
});
